import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { clearCart } from '../../actions/cartAction';

const OrderSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <FontAwesomeIcon
        icon={faCheckCircle}
        className='text-green-500'
        style={{ fontSize: '48px' }}
      />

      <h1 className='text-xl font-bold mt-4'>
        Your Order has been Placed successfully
      </h1>
      <Link to='/orders' className='mt-2 text-blue-600 hover:underline'>
        View Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
