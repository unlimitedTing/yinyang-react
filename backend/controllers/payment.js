const stripe = require('stripe')(
  'sk_test_51Q2yOQDy6xKOypJNRMjGMpf7EwAyWZ0XXt0HnC418zImUZky7r29TwKYihLWEMWgo99vA6YIgQS1v4QU8m3mlPOY00hGffiDOz'
);
const Order = require('../models/order');
exports.processPayment = async (req, res, next) => {
  let paymentMethodTypes = ['card'];

  // Check if UPI is selected
  if (req.body.upi) {
    paymentMethodTypes.push('upi');
  }

  // Check if GPay is selected
  if (req.body.gpay) {
    paymentMethodTypes.push('gpay');
  }

  // Check if Paytm is selected
  if (req.body.paytm) {
    paymentMethodTypes.push('paytm');
  }

  // Check if PhonePe is selected
  if (req.body.phonepe) {
    paymentMethodTypes.push('phonepe');
  }

  try {
    const myPayment = await stripe.paymentIntents.create({
      payment_method_types: paymentMethodTypes,
      amount: req.body.amount,
      currency: 'inr',
      metadata: {
        company: 'Order Planning'
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: myPayment.client_secret,
      message: 'Payment Successfully done'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Payment failed'
    });
  }
};

exports.sendStripeApiKey = async (req, res, next) => {
  res.status(200).json({
    stripeApiKey:
      'pk_test_51Q2yOQDy6xKOypJNx40jMtlDhHd2jAjYtEfjabMcFJaIiS2YKudhnrKJYpZuTjlevYt1sKRPhHRCNGutO9bB6s4V00xDxFPuVi'
  });
};
