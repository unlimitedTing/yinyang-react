import React from 'react';
import './Sidebar.css';
import logo from '../../images/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBoxOpen, faPlus, faClipboardList, faUsers, faStar } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    return (
        <div className='sidebar bg-gray-900 text-white h-full w-64 p-4'>
            <Link to='/'>
                <img src={logo} alt='Ecommerce' className='mb-8' />
            </Link>
            <Link to='/admin/dashboard' className='block mb-4'>
                <p className='flex items-center'>
                    <FontAwesomeIcon icon={faTachometerAlt} className='mr-2' /> Dashboard
                </p>
            </Link>
            
            <div className='mb-4'>
                <p className='flex items-center'>
                    <FontAwesomeIcon icon={faBoxOpen} className='mr-2' /> Products
                </p>
                <div className='ml-6'>
                    <Link to='/admin/products' className='block mb-2'>
                        <p className='flex items-center'>
                            <FontAwesomeIcon icon={faClipboardList} className='mr-2' /> All Products
                        </p>
                    </Link>
                    <Link to='/admin/product' className='block'>
                        <p className='flex items-center'>
                            <FontAwesomeIcon icon={faPlus} className='mr-2' /> Create Product
                        </p>
                    </Link>
                </div>
            </div>

            <Link to='/admin/orders' className='block mb-4'>
                <p className='flex items-center'>
                    <FontAwesomeIcon icon={faClipboardList} className='mr-2' /> Orders
                </p>
            </Link>
            <Link to='/admin/users' className='block mb-4'>
                <p className='flex items-center'>
                    <FontAwesomeIcon icon={faUsers} className='mr-2' /> Users
                </p>
            </Link>
            <Link to='/admin/reviews' className='block'>
                <p className='flex items-center'>
                    <FontAwesomeIcon icon={faStar} className='mr-2' /> Reviews
                </p>
            </Link>
        </div>
    );
};

export default Sidebar;
