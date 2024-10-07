import { FaUser, FaEnvelope, FaUserShield } from 'react-icons/fa';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  clearErrors,
  getUserDetails,
  updateUser
} from '../../actions/userAction';
// import SideBar from './Sidebar';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import Loader from '../Layout/Loader/Loader';
import MetaData from '../Layout/MetaData';

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, user } = useSelector(state => state.userDetails);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated
  } = useSelector(state => state.profile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  console.log('ID', id);
  console.log('userId', user);

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success('User Updated Successfully');
      navigate('/admin/users');
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, navigate, isUpdated, updateError, user, id]);

  const updateUserSubmitHandler = e => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('role', role);

    dispatch(updateUser(id, myForm));
  };

  return (
    <Fragment>
      <MetaData title='Update User' />
      {/* <div className='dashboard'> */}
      {/* <SideBar /> */}
      <div className='newProductContainer'>
        {loading ? (
          <Loader />
        ) : (
          <form
            className='createProductForm'
            onSubmit={updateUserSubmitHandler}
          >
            <h1>Update User</h1>

            <div>
              <FaUser className='text-gray-400' />
              <input
                type='text'
                placeholder='Name'
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <FaEnvelope className='text-gray-400' />
              <input
                type='email'
                placeholder='Email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <FaUserShield className='text-gray-400' />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value=''>Choose Role</option>
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
              </select>
            </div>

            <button
              id='createProductBtn'
              type='submit'
              disabled={updateLoading || role === ''}
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                updateLoading || role === ''
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
            >
              Update User
            </button>
          </form>
        )}
      </div>
      {/* </div> */}
    </Fragment>
  );
};

export default UpdateUser;
