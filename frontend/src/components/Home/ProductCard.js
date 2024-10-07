import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addProductToWishlist } from '../../actions/productAction';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product }) => {
  if (!product) {
    return <div>Loading...</div>; // Or handle loading state
  }
  // const dispatch = useDispatch();
  const { title, description, price, sizes, imageSrc } = product;

  return (
    <Fragment>
      <article className='flex flex-col max-md:mt-7 max-md:max-w-full md:flex-row'>
        {imageSrc && (
          <img
            loading='lazy'
            src={imageSrc}
            alt={`${title} product image`}
            className='object-contain w-full aspect-[1.18] md:w-1/2'
          />
        )}
        <div className='flex flex-col items-start self-center max-w-full w-full md:w-1/2'>
          <h2 className='text-6xl text-black leading-[105px] max-md:text-4xl max-md:leading-[78px]'>
            {title}
          </h2>
          <p className='self-stretch text-base leading-10 text-neutral-700 max-md:max-w-full'>
            {description}
          </p>
          <h3 className='mt-11 text-4xl text-black max-md:mt-10'>Size</h3>
          <div className='flex gap-6 mt-3.5 text-base text-black whitespace-nowrap'>
            {sizes.map((size, index) => (
              <span key={index}>{size}</span>
            ))}
          </div>
          <div className='flex gap-10 mt-7 max-w-full w-[500px]'>
            <button className='flex-1 px-6 py-4 bg-stone-900 text-base text-white text-opacity-90 max-md:px-5'>
              Add to Cart
            </button>
            <span className='grow shrink text-4xl text-black w-[109px]'>
              {price}
            </span>
          </div>
        </div>
      </article>
    </Fragment>
  );
};

export default ProductCard;
