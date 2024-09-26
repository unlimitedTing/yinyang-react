import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './ProductGridItem.css'; // Ensure this file handles Tailwind styles

const ProductGridItem = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const renderRating = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={`text-yellow-500 ${
            i < Math.round(product.ratings) ? 'opacity-100' : 'opacity-50'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div
        className='productGridItem relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={product.images[0].url}
          alt={product.name}
          className='w-full h-48 object-cover rounded-t-lg'
        />

        {hovered && (
          <div className='absolute inset-0 bg-white p-4 flex flex-col justify-center items-start opacity-95 rounded-b-lg'>
            <h3 className='font-bold text-lg mb-2'>{product.name}</h3>
            <p className='mb-2'>{product.description}</p>
            <span className='text-xl font-semibold mb-2'>{`₹${product.price}`}</span>
            <div className='flex mb-2'>{renderRating()}</div>
            <span className='text-gray-500'>
              ({product.numOfReviews} Reviews)
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductGridItem;
