import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeProductFromWishlist,
  getProductDetails
} from '../../actions/productAction';

const WishlistProductCard = ({ productId }) => {
  const dispatch = useDispatch();

  // Get the product details from the Redux state
  const { product, loading, error } = useSelector(
    state => state.productDetails
  );

  // Fetch the product details when component mounts or productId changes
  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  const deleteWishlistProduct = () => {
    toast.success('Product Removed from wishlist');
    dispatch(removeProductFromWishlist(productId));
  };

  if (loading || !product) return <p>Loading...</p>;
  if (error) return <p>Error loading product details: {error}</p>;
  return (
    <Fragment>
      <Link
        className='block border rounded-md shadow-md p-4 hover:shadow-lg transition'
        to={`/product/${product._id}`}
      >
        <p className='font-semibold text-lg'>{product.name}</p>

        <span className='font-bold text-xl'>{`$${product.price}`}</span>
        <button
          onClick={deleteWishlistProduct}
          className='mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition'
        >
          Remove from Wishlist
        </button>
      </Link>
    </Fragment>
  );
};

export default WishlistProductCard;
