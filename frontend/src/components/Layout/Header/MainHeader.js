// import React, { useState } from 'react';
// import { FaSearch, FaShoppingCart, FaHeart } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { logout } from '../../../actions/userAction';
// import './MainHeader.css';

// const MainHeader = () => {
//   const { isAuthenticated, user } = useSelector(state => state.user);
//   const { cartItems } = useSelector(state => state.cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState('');

//   const searchSubmitHandler = e => {
//     e.preventDefault();
//     if (product.trim()) {
//       navigate(`/products/${product}`);
//     } else {
//       navigate('/products');
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/');
//     toast.success('Logout Successfully');
//   };

//   return (
//     <nav className='flex items-center justify-between p-4 bg-gray-800 text-white'>
//       <div className='flex items-center'>
//         <Link to='/'>
//           <img
//             src='https://ecommerce-bucket-sdk.s3.ap-south-1.amazonaws.com/Ecommerce-logo.png'
//             alt='order-planning'
//             className='h-10'
//           />
//         </Link>
//         <div className='flex space-x-4 ml-4'>
//           {user?.role === 'admin' && (
//             <Link to='/admin/dashboard' className='hover:underline'>
//               Dashboard
//             </Link>
//           )}
//           <Link to='/products' className='hover:underline'>
//             Products
//           </Link>
//           <Link to='/orders' className='hover:underline'>
//             Orders
//           </Link>
//           <Link to='/contact-us' className='hover:underline'>
//             Contact
//           </Link>
//           <Link to='/about' className='hover:underline'>
//             About
//           </Link>
//         </div>
//       </div>
//       <div className='flex items-center'>
//         <form className='relative' onSubmit={searchSubmitHandler}>
//           <input
//             type='text'
//             placeholder='Search a Product...'
//             onChange={e => setProduct(e.target.value)}
//             className='border rounded-lg p-2'
//           />
//           <button type='submit' className='absolute inset-y-0 right-0 p-2'>
//             <FaSearch />
//           </button>
//         </form>

//         <Link to='/wishlist' className='ml-4'>
//           <FaHeart className='text-xl' />
//         </Link>

//         <Link to='/cart' className='ml-4 relative'>
//           <FaShoppingCart className='text-xl' />
//           {cartItems.length > 0 && (
//             <span className='absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1'>
//               {cartItems.length}
//             </span>
//           )}
//         </Link>

//         {isAuthenticated ? (
//           <div className='ml-4 flex items-center'>
//             <Link to='/account'>
//               <img
//                 src={user.avatar ? user.avatar : '/Profile.png'}
//                 alt={`${user.name}`}
//                 className='w-10 h-10 rounded-full'
//               />
//             </Link>
//             <button onClick={handleLogout} className='ml-2 text-red-400'>
//               Logout
//             </button>
//           </div>
//         ) : (
//           <Link to='/login' className='ml-4 text-blue-500'>
//             Login
//           </Link>
//         )}
//         <Link
//           to='/join/plus-membership'
//           className='ml-4 bg-blue-500 text-white px-3 py-1 rounded'
//         >
//           Subscribe
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default MainHeader;

import React from 'react';
import NavigationItem from './NavigationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

const navigationItems = [
  { label: 'Products', width: '71px', href: '/products' },
  { label: 'WishList', width: '88px', href: '/wishlist' },
  { label: 'Account', width: '75px', href: '/account' },
  { label: 'Contact Us', width: '86px', href: '/contact-us' }
];

function Header() {
  return (
    <header className='flex flex-col pt-3.5 pb-1 w-full bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.25)] max-md:max-w-full'>
      <div className='flex justify-between items-center w-full max-w-[1380px] mx-auto'>
        <h1 className='text-5xl font-bold text-black border border-white border-solid max-md:text-4xl'>
          <a href='/'>YINYANG</a>
        </h1>
        <div className='flex gap-8 items-center'>
          <a href='/search' aria-label='Search'>
            <FontAwesomeIcon icon={faSearch} className='mr-2' />
          </a>
          <a href='/login' aria-label='Signup'>
            <FontAwesomeIcon icon={faUser} className='mr-2' />
          </a>
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
