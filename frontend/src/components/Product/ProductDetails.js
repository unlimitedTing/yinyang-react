import React, { Fragment, useEffect, useState } from 'react';
import ModalImage from 'react-modal-image';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { addItemsToCart } from '../../actions/cartAction';
import {
  addProductToWishlist,
  clearErrors,
  getProductDetails,
  newReview
} from '../../actions/productAction';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import MetaData from '../Layout/MetaData';
import ReviewCard from './ReviewCard';

import './ProductDetails.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, loading, error } = useSelector(
    state => state.productDetails
  );

  const { wishlist } = useSelector(state => state.wishlist);
  const { success, error: reviewError } = useSelector(state => state.newReview);

  const [progress, setProgress] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const onLoaderFinished = () => setProgress(0);

  const increaseQuantity = () => {
    if (product.Stock > quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartHandler = () => {
    console.log(id);
    dispatch(addItemsToCart(id, quantity));
    toast.success('Item Added To Cart');
    setProgress(progress + 80);
  };

  const wishlistHandler = () => {
    const isProductInWishlist = wishlist.some(item => item.product === id);

    if (isProductInWishlist) {
      toast.info('Product is already in the wishlist');
    } else {
      dispatch(addProductToWishlist(id));
      toast.success('Item Added To Wishlist');
    }
    setProgress(progress + 80);
  };

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const reviewSubmitHandler = () => {
    const reviewData = new FormData();
    reviewData.set('productId', id);
    reviewData.set('comment', comment);
    reviewData.set('rating', rating);

    dispatch(newReview(reviewData));
    setOpen(false);
    setProgress(progress + 80);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success('Review Added Successfully');
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, id, error, reviewError, success]);

  return (
    <Fragment>
      {loading ? (
        <LoadingBar
          color='red'
          progress={progress}
          onLoaderFinished={onLoaderFinished}
        />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className='p-4'>
            <div>
              {product.images && product.images.length > 0 && (
                <Carousel showThumbs={false}>
                  {product.images.map((item, i) => (
                    <div key={i}>
                      <ModalImage
                        small={item.url}
                        large={item.url}
                        alt={`Image ${i}`}
                        className='CarouselImage'
                      />
                    </div>
                  ))}
                </Carousel>
              )}
            </div>

            <div className='bg-white p-4 rounded-lg shadow-md'>
              <div className='detailsBlock-1'>
                <h2 className='text-2xl'>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className='detailsBlock-2'>
                <span>{`Rating: ${product.ratings}`}</span>
                <span className='detailsBlock-2-span'>
                  {' '}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className='detailsBlock-3'>
                <h1>{`${product.price}`}</h1>
                <div className='flex items-center'>
                  <button
                    onClick={decreaseQuantity}
                    className='px-2 bg-gray-300'
                  >
                    -
                  </button>
                  <input
                    readOnly
                    type='number'
                    value={quantity}
                    className='mx-2 w-12 text-center border rounded'
                  />
                  <button
                    onClick={increaseQuantity}
                    className='px-2 bg-gray-300'
                  >
                    +
                  </button>
                  <button
                    onClick={wishlistHandler}
                    className='ml-2 bg-blue-500 text-white px-4 py-2 rounded'
                  >
                    Add to Wishlist
                  </button>
                  <button
                    disabled={product.Stock < 1}
                    onClick={addToCartHandler}
                    className='ml-2 bg-green-500 text-white px-4 py-2 rounded'
                  >
                    Add to Cart
                  </button>
                </div>
                <p>
                  Status:
                  <b
                    className={
                      product.Stock < 1 ? 'text-red-500' : 'text-green-500'
                    }
                  >
                    {product.Stock < 1 ? 'Out Of Stock' : 'In Stock'}
                  </b>
                </p>
              </div>
              <div className='detailsBlock-4'>
                <p>Description: {product.description}</p>
              </div>
              <button
                onClick={submitReviewToggle}
                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'
              >
                Submit Review
              </button>
            </div>
          </div>

          {open && (
            <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
              <div className='bg-white rounded-lg p-4 max-w-md w-full'>
                <h3 className='text-lg font-semibold'>Submit Review</h3>
                <div className='mt-4'>
                  <input
                    type='number'
                    min='1'
                    max='5'
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    className='border rounded p-2 w-full'
                    placeholder='Rating (1-5)'
                  />
                  <textarea
                    className='border rounded mt-2 p-2 w-full'
                    cols='30'
                    rows='5'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder='Write your review...'
                  />
                </div>
                <div className='flex justify-end mt-4'>
                  <button
                    onClick={submitReviewToggle}
                    className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={reviewSubmitHandler}
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          <h3 className='text-lg font-semibold mt-6'>REVIEWS</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className='reviews'>
              {product.reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className='noReviews'>No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
