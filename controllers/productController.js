const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// List all products
const getAllProducts = async (req, res) => {
  try {
    const products = await stripe.products.list();
    res.status(200).json(products.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const product = await stripe.products.create({
      name,
      description,
    });

    if (price) {
      await stripe.prices.create({
        unit_amount: price * 100, // convert to cents
        currency: 'eur', // or your desired currency
        product: product.id,
      });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit a product
const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, active } = req.body;

  try {
    const updatedProduct = await stripe.products.update(productId, {
      name,
      description,
      active,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await stripe.products.del(productId);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product
const getProductById = async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await stripe.products.retrieve(productId);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById, 
  };