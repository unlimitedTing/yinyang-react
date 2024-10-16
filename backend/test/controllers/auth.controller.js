const User = require('../../models/user');
const stripe = require('stripe')(
  'sk_test_51Q2yOQDy6xKOypJNRMjGMpf7EwAyWZ0XXt0HnC418zImUZky7r29TwKYihLWEMWgo99vA6YIgQS1v4QU8m3mlPOY00'
);

async function registerUser(req) {
  const { name, email, password } = req.body;
  const file = req.file;

  const customer = await stripe.customers.create({
    email,
    source: 'tok_visa'
  });
  const user = await User.create({
    name,
    email,
    password,
    stripeCustomerId: customer.id
  });

  return user;
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // checking if user has given email and password both
    if (!email || !password) {
      return 'Please Enter Email and Password';
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return 'Invalid Email or Password';
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return 'Invalid Email or Password';
    }

    console.log(user);

    return user;
  } catch (err) {
    return 'Failed to Login';
  }
}

module.exports = {
  registerUser,
  loginUser
};
