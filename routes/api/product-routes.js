const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll(
      {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'assigned_tags' }],
      }
    );
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productSingleData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'assigned_tags'}],
    });

    if (!productSingleData) {
      res.status(404).json({ message: 'No product found with that id, double check your id.' });
      return;
    }

    res.status(200).json(productSingleData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    // We need to create pairings to bulk create in the ProductTag model
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: newProduct.id,
        tag_id,
      };
    }
    )
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const productUpdate = await Product.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!productUpdate[0]) {
      res.status(404).json({ message: 'No product found with that id, double check your id.' });
      return;
    }
    // We need to create pairings to bulk create in the ProductTag model
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
      };
    })

    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    res.status(200).json(productTagIds);

  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async  (req, res) => {
  // delete one product by its `id` value
  try {
    const productDelete = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productDelete) {
      res.status(404).json({ message: 'No product found with that id, double check your id.' });
      return;
    }
    res.status(200).json(productDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
