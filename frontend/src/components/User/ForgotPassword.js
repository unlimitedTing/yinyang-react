import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { clearErrors, forgotPassword } from '../../actions/userAction';
import MetaData from '../Layout/MetaData';
import { FaEnvelope } from 'react-icons/fa'; // FontAwesome Envelope Icon

import './ForgotPassword.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector(
    state => state.forgotPassword
  );

  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);

  const onLoaderFinished = () => setProgress(0);

  const forgotPasswordSubmit = e => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('email', email);
    dispatch(forgotPassword(myForm));
    setProgress(50);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, error, message]);

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
          <MetaData title='Forgot Password' />
          <div className='flex items-center justify-center h-screen'>
            <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
              <h2 className='text-xl font-semibold text-center mb-4'>
                Forgot Password
              </h2>

              <form className='flex flex-col' onSubmit={forgotPasswordSubmit}>
                <div className='flex items-center border-b mb-4'>
                  <FaEnvelope className='text-gray-500 mr-2' />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    name='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='flex-grow p-2 focus:outline-none'
                  />
                </div>

                <input
                  type='submit'
                  value='Send'
                  className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300'
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
