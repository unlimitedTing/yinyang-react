import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logout } from '../../../actions/userAction';

import './AdminHeader.css';

const AdminHeader = () => {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logout Successfully');
  };

  const navigate = useNavigate();

  return (
    <nav className='nav'>
      <div className='nav-menu flex-row'>
        <div className='nav-brand'>
          <Link to='/'>
            <h1>YinYang</h1>
          </Link>
        </div>
        <div className='toggle-collapse'>
          <p>MENU</p>
        </div>
        <div>
          <div className='nav-items'>
            <Link to='/admin/dashboard' className='nav-link'>
              Dashboard
            </Link>
            <Link to='/admin/products' className='nav-link'>
              Products
            </Link>
            <Link to='/admin/add-product' className='nav-link'>
              Add-Product
            </Link>
            <Link to='/admin/orders' className='nav-link'>
              Orders
            </Link>
            <Link to='/admin/reviews' className='nav-link'>
              Reviews
            </Link>
            <Link to='/admin/users' className='nav-link'>
              Users
            </Link>
            <Link to='/admin/returns' className='nav-link'>
              Returns
            </Link>
            <Link to='/admin/refunds' className='nav-link'>
              Refunds
            </Link>
          </div>
        </div>
        <div className='social'>
          {isAuthenticated ? (
            <div className='user-profile'>
              <Link to='/account'>
                <p>{user.name}</p>
              </Link>
              <button onClick={handleLogout} className='logout-button'>
                Logout
              </button>
            </div>
          ) : (
            <Link to='/login' className='login-button'>
              Login
            </Link>
          )}
          <Link to='/join/plus-membership' className='platinum-btn'>
            Subscribe
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
