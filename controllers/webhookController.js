const stripe = require('stripe')('your_stripe_secret_key');

class WebhookController {
  static async handleWebhook(req, res) {
    const endpointSecret = 'your_webhook_secret';
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      // Handle specific event types
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log('Payment successful:', session);
          // Fulfill order or update database here
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).send('Webhook received');
    } catch (err) {
      console.error('Webhook error:', err.message);
      res.status(400).send('Webhook Error');
    }
  }
}

module.exports = WebhookController;