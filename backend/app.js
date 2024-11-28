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
const cloudinary = require('cloudinary').v2;

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

// Serve static files from the "uploads" folder
app.use(
  '/uploads',
  cors(corsOptions),
  express.static(path.join(__dirname, 'uploads'))
);

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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

    // Upload avatar to Cloudinary if an image is uploaded
    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: 'avatars',
        public_id: `${userId}_${Date.now()}`,
        overwrite: true
      });
      avatarUrl = uploadResponse.secure_url;
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

    // Delete avatar file from Cloudinary
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0]; // Extract public_id from Cloudinary URL
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
      console.log('✅ Avatar deleted from Cloudinary');
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
      const { name, description, price, category, Stock, images } = req.body;

      if (!images || images.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'No images uploaded' });
      }
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      // 验证 Base64 格式
      const matches = images.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image format'
        });
      }

      // 提取图片数据和文件扩展名
      const imageData = matches[2]; // 提取 Base64 编码的数据
      // 上传到 Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${imageData}`,
        {
          folder: 'products', // 存储在 Cloudinary 的 products 文件夹中
          public_id: `${Date.now()}`
        }
      );
      const imageUrl = uploadResponse.secure_url;

      // Construct the images array to match the schema
      const imageArray = [
        {
          _id: `${Date.now()}`, // Generate a unique ID
          url: imageUrl
        }
      ];
      // Save product to the database
      const product = await Product.create({
        name,
        description,
        price,
        category,
        Stock,
        images: imageArray
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

    // Delete old images from Cloudinary
    for (const image of product.images) {
      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    // Upload new image to Cloudinary
    const imageArray = [];
    if (req.body.images) {
      const matches = req.body.images.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const uploadResponse = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${matches[2]}`,
          {
            folder: 'products',
            public_id: `${Date.now()}`
          }
        );
        imageArray.push({
          _id: `${Date.now()}`,
          url: uploadResponse.secure_url
        });
      }
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

    // Delete associated images from Cloudinary
    for (const image of product.images) {
      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

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
