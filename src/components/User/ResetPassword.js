import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { clearErrors, resetPassword } from '../../actions/userAction';
import MetaData from '../Layout/MetaData';
import { FaLock, FaUnlock } from 'react-icons/fa'; // FontAwesome Icons

import './ResetPassword.css';

const ResetPassword = ({ match }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success, loading } = useSelector(
    state => state.forgotPassword
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [progress, setProgress] = useState(0);

  const onLoaderFinished = () => setProgress(0);

  const resetPasswordSubmit = e => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('password', password);
    myForm.set('confirmPassword', confirmPassword);

    dispatch(resetPassword(match.params.token, myForm));
    setProgress(50);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success('Password Updated Successfully');
      navigate('/login');
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, error, navigate, success]);

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
          <MetaData title='Change Password' />
          <div className='flex items-center justify-center min-h-screen'>
            <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
              <h2 className='text-xl font-bold mb-4'>Update Password</h2>

              <form
                className='resetPasswordForm'
                onSubmit={resetPasswordSubmit}
              >
                <div className='flex items-center border-b mb-4'>
                  <FaUnlock className='text-gray-500 mr-2' />
                  <input
                    type='password'
                    placeholder='New Password'
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='flex-grow p-2 focus:outline-none'
                  />
                </div>
                <div className='flex items-center border-b mb-4'>
                  <FaLock className='text-gray-500 mr-2' />
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className='flex-grow p-2 focus:outline-none'
                  />
                </div>
                <input
                  type='submit'
                  value='Update'
                  className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 w-full'
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
