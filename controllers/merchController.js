const stripe = require('stripe')('your_stripe_secret_key');

class MerchController {
  // Create a new checkout session
  static async createCheckoutSession(req, res) {
    try {
      const { products } = req.body; // Array of { priceId, quantity }
      const line_items = products.map(product => ({
        price: product.priceId,
        quantity: product.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
      });

      res.send({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send({ error: 'Failed to create checkout session' });
    }
  }

  // Retrieve the status of a checkout session
  static async sessionStatus(req, res) {
    try {
      const { session_id } = req.query;
      const session = await stripe.checkout.sessions.retrieve(session_id);

      res.send({
        status: session.payment_status,
        customer_email: session.customer_details.email,
      });
    } catch (error) {
      console.error('Error retrieving session status:', error);
      res.status(500).send({ error: 'Failed to retrieve session status' });
    }
  }
}

module.exports = MerchController;

// // controllers/MerchController.js
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// class MerchController {
//   // Create a new checkout session
//   static async createCheckoutSession(req, res) {
//     try {
//       const { products } = req.body; // Expecting an array of { priceId, quantity }

//       const line_items = products.map(product => ({
//         price: product.priceId,
//         quantity: product.quantity,
//       }));

//       const session = await stripe.checkout.sessions.create({
//         line_items,
//         mode: 'payment',
//         success_url: `${process.env.YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
//       });

//       res.send({ sessionId: session.id });
//     } catch (error) {
//       console.error('Error creating checkout session:', error);
//       res.status(500).send({ error: 'Failed to create checkout session' });
//     }
//   }

//   // Retrieve the status of a checkout session
//   static async sessionStatus(req, res) {
//     try {
//       const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

//       res.send({
//         status: session.status,
//         customer_email: session.customer_details.email,
//       });
//     } catch (error) {
//       console.error('Error retrieving session status:', error);
//       res.status(500).send({ error: 'Failed to retrieve session status' });
//     }
//   }
// }

// module.exports = MerchController;