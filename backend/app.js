const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorMiddleware = require('./middleware/error');
const logger = require('./middleware/logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(
  'sk_test_51Q2yOQDy6xKOypJNRMjGMpf7EwAyWZ0XXt0HnC418zImUZky7r29TwKYihLWEMWgo99vA6YIgQS1v4QU8m3mlPOY00hGffiDOz'
);
require('dotenv').config({ path: '/backend/config/config.env' });

const User = require('./models/user');
const Product = require('./models/product');

// Configure CORS
const allowedOrigins = [
  'https://yinyangfrontend.netlify.app', // Your frontend domain on Netlify
  'http://localhost:3000' // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Enable cookies if needed
};

app.use(cors(corsOptions));

// Custom headers for specific routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Middleware for parsing cookies, JSON, and form data
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
  })
);

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer storage for local file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the uploads folder if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
});

// Route Imports
const productRoute = require('./routes/product');
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const paymentRoute = require('./routes/payment');
const couponRoute = require('./routes/coupon');
const subscriptionRoute = require('./routes/plusMembership');

app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', paymentRoute);
app.use('/api/v1', couponRoute);
app.use('/api/v1', subscriptionRoute);

// Middleware for logging and errors
app.use(errorMiddleware);
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello, welcome to my API!');
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET_KEY
    );

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res.status(201).cookie('token', token, options).json({
      success: true,
      user
    });
  } catch (err) {
    console.error('⚠️ Error:', err);
    res.status(500).json({
      success: false,
      message: '⚠️ Error: ' + err.message
    });
  }
});

app.put('/me/update', upload.single('image'), async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the request (assumes authentication middleware sets `req.user`)
    const { name, email } = req.body;
    const file = req.file;

    let avatarUrl;

    // Save the avatar locally if an image is uploaded
    if (file) {
      avatarUrl = `/uploads/${file.filename}`;
    }

    // Update the user profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar: avatarUrl }, // Update the avatar URL if provided
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: '✅ Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('⚠️ Error updating profile:', error);
    res
      .status(500)
      .json({ success: false, error: '⚠️ Internal server error.' });
  }
});

app.delete('/admin/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: '⚠️ User not found' });
    }

    // Delete avatar file from local storage
    if (user.avatar) {
      const filePath = path.join(__dirname, user.avatar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the avatar file
        console.log('✅ Avatar deleted from local storage');
      }
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    console.log('✅ User deleted from database:', user);

    res.status(200).json({
      success: true,
      message: '✅ User deleted successfully.'
    });
  } catch (error) {
    console.error('⚠️ Error deleting user:', error);
    res
      .status(500)
      .json({ success: false, error: '⚠️ Internal server error.' });
  }
});

// Route to add a product
app.post(
  '/admin/add-product',
  upload.array('product', 10),
  async (req, res) => {
    try {
      const { name, description, price, category, Stock } = req.body;
      const files = req.files;

      if (!files || files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'No images uploaded' });
      }

      const imageUrls = files.map(file => `/uploads/${file.filename}`);

      // Save product to the database
      const product = await Product.create({
        name,
        description,
        price,
        category,
        Stock,
        images: imageUrls.map(url => ({ url }))
      });

      res.status(201).json({
        message: '✅ Product created successfully.',
        product
      });
    } catch (error) {
      console.error('⚠️ Error creating product:', error);
      res
        .status(500)
        .json({ success: false, error: '⚠️ Internal server error.' });
    }
  }
);

app.put('/admin/product/:id', upload.array('product', 10), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, stock } = req.body;
    const files = req.files;

    let imageUrls = [];

    // Find the existing product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: '⚠️ Product not found' });
    }

    // Delete old images from local storage
    product.images.forEach(image => {
      const filePath = path.join(__dirname, image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Remove the file from the local filesystem
        console.log(`✅ Deleted image: ${filePath}`);
      }
    });

    // Save new images to local storage
    if (files && files.length > 0) {
      imageUrls = files.map(file => ({
        url: `/uploads/${file.filename}` // Store relative path to the image
      }));
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        category,
        stock,
        images: imageUrls // Save new image URLs
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: '⚠️⚠️ Product not found.' });
    }

    res.status(200).json({
      message: '✅ Product updated successfully.',
      product: updatedProduct
    });
  } catch (error) {
    console.error('⚠️ Error processing request:', error);
    res.status(500).json({
      success: false,
      error: '⚠️ Internal server error.'
    });
  }
});

// Route to delete a product
app.delete('/admin/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: '⚠️ Product not found' });
    }

    // Delete associated images from local storage
    product.images.forEach(image => {
      const filePath = path.join(__dirname, image.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: '✅ Product deleted successfully.'
    });
  } catch (error) {
    console.error('⚠️ Error deleting product:', error);
    res
      .status(500)
      .json({ success: false, error: '⚠️ Internal server error.' });
  }
});

// Middleware for handling unknown routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
