import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { removeProductFromWishlist } from '../../actions/productAction';

const WishlistProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images;

  const deleteWishlistProduct = () => {
    toast.success('Product Removed from wishlist');
    dispatch(removeProductFromWishlist(product._id));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(nextIndex);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, images.length]);

  return (
    <Fragment>
      <Link
        className='block border rounded-md shadow-md p-4 hover:shadow-lg transition'
        to={`/product/${product._id}`}
      >
        <div className='relative overflow-hidden h-48 mb-2'>
          <img
            src={images[currentImageIndex].url}
            alt={product.name}
            className='object-cover w-full h-full'
          />
        </div>
        <p className='font-semibold text-lg'>{product.name}</p>
        <div className='flex items-center mb-2'>
          <div className='flex'>
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 ${
                  index < product.ratings ? 'text-yellow-500' : 'text-gray-300'
                }`}
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 .587l3.668 7.431 8.148 1.182-5.895 5.712 1.392 8.094L12 18.897l-7.313 3.849 1.392-8.094-5.895-5.712 8.148-1.182z' />
              </svg>
            ))}
          </div>
          <span className='text-sm text-gray-600 ml-2'>
            ({product.numOfReviews} Reviews)
          </span>
        </div>
        <span className='font-bold text-xl'>{`₹${product.price}`}</span>
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
