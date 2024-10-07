import React from 'react';
import profilePng from '../../images/Profile.png';

const ReviewCard = ({ review }) => {
  return (
    <div className='flex flex-col p-4 border rounded-md shadow-md bg-white'>
      <div className='flex items-center mb-2'>
        <img
          src={profilePng}
          alt='User'
          className='w-10 h-10 rounded-full mr-2'
        />
        <p className='font-semibold'>{review.name}</p>
      </div>
      <div className='flex mb-2'>
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < review.rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M12 .587l3.668 7.431 8.148 1.182-5.895 5.712 1.392 8.094L12 18.897l-7.313 3.849 1.392-8.094-5.895-5.712 8.148-1.182z' />
          </svg>
        ))}
      </div>
      <span className='text-gray-700'>{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
