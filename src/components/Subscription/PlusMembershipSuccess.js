import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart } from '../../actions/cartAction';
import { FaCheckCircle } from 'react-icons/fa'; // Importing FontAwesome Check Circle icon

const PlusMembershipSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <FaCheckCircle className='text-green-500 text-5xl mb-4' />
      <h2 className='text-xl font-semibold mb-2'>
        Now you are a member of the Order Planning Plus Family
      </h2>
      <Link to='/products' className='text-blue-500 hover:underline'>
        Enjoy your Shopping
      </Link>
    </div>
  );
};

export default PlusMembershipSuccess;
