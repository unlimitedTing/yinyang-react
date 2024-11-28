const express = require('express');
const {
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  addToWishList,
  removeFromWishList,
  getAllWishlistProducts
} = require('../controllers/product');

const router = express.Router();

router.route('/products').get(getAllProducts);

router.route('/wishlist').get(getAllWishlistProducts);

router.route('/wishlist/:id').post(addToWishList).delete(removeFromWishList);

router.route('/admin/products').get(getAdminProducts);

router.route('/product/:id').get(getProductDetails);

router.route('/review').post(createProductReview);

router.route('/reviews').get(getProductReviews);

router.route('/review/:reviewId').delete(deleteReview);

module.exports = router;
