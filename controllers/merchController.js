const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Mocked product data; replace with a call to Stripe if using Stripe products
const products = [
  { id: "prod_1", name: "Merch Product 1", price: 2000, currency: "usd" },
  { id: "prod_2", name: "Merch Product 2", price: 3000, currency: "usd" },
];

// List all merchandise products
router.get('/', (req, res) => {
  res.json(products);
});

// Add to cart (simplified; could use session or a database)
router.post('/cart', (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  req.session.cart = req.session.cart || [];
  req.session.cart.push(product);
  res.json({ cart: req.session.cart });
});

// View cart
router.get('/cart', (req, res) => {
  res.json(req.session.cart || []);
});

// Checkout with Stripe
router.post('/checkout', async (req, res) => {
  try {
    const cart = req.session.cart || [];

    const lineItems = cart.map(item => ({
      price_data: {
        currency: item.currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { merch: router };