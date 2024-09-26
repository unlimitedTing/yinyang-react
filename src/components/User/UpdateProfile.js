import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../Layout/MetaData';
import { FaUser, FaEnvelope } from 'react-icons/fa'; // FontAwesome Icons

import './UpdateProfile.css';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state => state.user);
  const { error, isUpdated, loading } = useSelector(state => state.profile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');
  const [progress, setProgress] = useState(0);

  const onLoaderFinished = () => setProgress(0);

  const updateProfileSubmit = e => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('avatar', avatar);

    dispatch(updateProfile(myForm));
    setProgress(50);
  };

  const updateProfileDataChange = e => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(e.target.files[0]); // Changed to store the file instead of the data URL
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success('Profile Updated Successfully');
      dispatch(loadUser());
      navigate('/account');

      dispatch({ type: UPDATE_PROFILE_RESET });
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, error, navigate, user, isUpdated]);

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
          <MetaData title='Update Profile' />
          <div className='flex items-center justify-center min-h-screen'>
            <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
              <h2 className='text-xl font-bold mb-4'>Update Profile</h2>

              <form
                className='updateProfileForm'
                encType='multipart/form-data'
                onSubmit={updateProfileSubmit}
              >
                <div className='flex items-center border-b mb-4'>
                  <FaUser className='text-gray-500 mr-2' />
                  <input
                    type='text'
                    placeholder='Name'
                    required
                    name='name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='flex-grow p-2 focus:outline-none'
                  />
                </div>

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

                <div id='updateProfileImage' className='mb-4'>
                  <img
                    src={avatarPreview}
                    alt='Avatar Preview'
                    className='w-32 h-32 rounded-full object-cover mb-2'
                  />
                  <input
                    type='file'
                    name='avatar'
                    accept='image/*'
                    onChange={updateProfileDataChange}
                    className='block'
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

export default UpdateProfile;
