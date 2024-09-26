import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { clearErrors, login, register } from '../../actions/userAction';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'; // FontAwesome Icons

import './LoginAndRegister.css';

const LoginAndRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, isAuthenticated } = useSelector(state => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [progress, setProgress] = useState(0);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = user;
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [avatar, setAvatar] = useState('/Profile.png');
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');

  const loginSubmit = e => {
    e.preventDefault();
    setProgress(50);
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = e => {
    e.preventDefault();
    setProgress(50);

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);
    myForm.set('avatar', avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = e => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate('/');
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, error, navigate, isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === 'login') {
      switcherTab.current.classList.add('shiftToNeutral');
      switcherTab.current.classList.remove('shiftToRight');
      registerTab.current.classList.remove('shiftToNeutralForm');
      loginTab.current.classList.remove('shiftToLeft');
    }
    if (tab === 'register') {
      switcherTab.current.classList.add('shiftToRight');
      switcherTab.current.classList.remove('shiftToNeutral');
      registerTab.current.classList.add('shiftToNeutralForm');
      loginTab.current.classList.add('shiftToLeft');
    }
  };

  return (
    <Fragment>
      {loading ? (
        <LoadingBar
          color='red'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      ) : (
        <Fragment>
          <div className='flex items-center justify-center min-h-screen'>
            <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
              <div className='flex justify-between mb-4'>
                <p
                  className='cursor-pointer'
                  onClick={e => switchTabs(e, 'login')}
                >
                  LOGIN
                </p>
                <p
                  className='cursor-pointer'
                  onClick={e => switchTabs(e, 'register')}
                >
                  REGISTER
                </p>
              </div>
              <button ref={switcherTab} className='hidden'></button>

              <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                <div className='flex items-center border-b mb-4'>
                  <FaEnvelope className='text-gray-500 mr-2' />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className='flex-grow p-2 focus:outline-none'
                  />
                </div>
                <div className='flex items-center border-b mb-4'>
                  <FaLock className='text-gray-500 mr-2' />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder='Password'
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className='flex-grow p-2 focus:outline-none'
                  />
                  <span
                    className='cursor-pointer'
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <Link to='/password/forgot' className='text-blue-500 mb-4'>
                  Forget Password?
                </Link>
                <input
                  type='submit'
                  value='Login'
                  className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300'
                />
              </form>

              <form
                className='signUpForm'
                ref={registerTab}
                encType='multipart/form-data'
                onSubmit={registerSubmit}
              >
                <div className='flex items-center border-b mb-4'>
                  <FaUser className='text-gray-500 mr-2' />
                  <input
                    type='text'
                    placeholder='Name'
                    required
                    name='name'
                    value={name}
                    onChange={registerDataChange}
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
                    onChange={registerDataChange}
                    className='flex-grow p-2 focus:outline-none'
                  />
                </div>
                <div className='flex items-center border-b mb-4'>
                  <FaLock className='text-gray-500 mr-2' />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder='Password'
                    required
                    name='password'
                    value={password}
                    onChange={registerDataChange}
                    className='flex-grow p-2 focus:outline-none'
                  />
                  <span
                    className='cursor-pointer'
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                  >
                    {showRegisterPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <div id='registerImage' className='mb-4'>
                  <img
                    src={avatarPreview}
                    alt='Avatar Preview'
                    className='w-24 h-24 mb-2'
                  />
                  <input
                    type='file'
                    name='avatar'
                    accept='image/*'
                    onChange={registerDataChange}
                    className='p-2 border border-gray-300 rounded'
                  />
                </div>
                <input
                  type='submit'
                  value='Register'
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

export default LoginAndRegister;
