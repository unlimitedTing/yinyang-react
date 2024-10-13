import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavigationItem from './NavigationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../../actions/userAction';

const navigationItems = [
  { label: 'Products', width: '71px', href: '/products' },
  { label: 'WishList', width: '88px', href: '/wishlist' },
  { label: 'Account', width: '75px', href: '/account' },
  { label: 'Contact Us', width: '86px', href: '/contact-us' }
];

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.user);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  return (
    <header className='flex flex-col pt-3.5 pb-1 w-full bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.25)] max-md:max-w-full'>
      <div className='flex justify-between items-center w-full max-w-[1380px] mx-auto'>
        <h1 className='text-5xl font-bold text-black border border-white border-solid max-md:text-4xl'>
          <a href='/'>YINYANG</a>
        </h1>
        <div className='flex gap-8 items-center'>
          <a href='/cart' aria-label='Cart'>
            <FontAwesomeIcon icon={faShoppingCart} className='mr-2' />
          </a>
          <button
            onClick={handleAuthClick}
            aria-label={isAuthenticated ? 'Logout' : 'Login'}
          >
            <FontAwesomeIcon icon={faUser} className='mr-2' />
            <span className='ml-1'>{isAuthenticated ? 'Logout' : 'Login'}</span>
          </button>
        </div>
      </div>
      <div className='mt-5 w-full border-black border-solid border-[7px] min-h-[7px] max-md:max-w-full' />
      <nav className='flex gap-10 items-center mt-7 mx-9 text-base font-medium text-zinc-800'>
        {navigationItems.map((item, index) => (
          <NavigationItem
            key={index}
            label={item.label}
            width={item.width}
            href={item.href}
          />
        ))}
      </nav>
    </header>
  );
}

export default Header;
