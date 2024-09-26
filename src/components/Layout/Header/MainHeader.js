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
import SocialIcon from './SocialIcon';

const navigationItems = [
  { label: 'Products', width: '71px' },
  { label: 'Collections', width: '88px' },
  { label: 'Gift ideas', width: '75px' },
  { label: 'Contact Us', width: '86px' }
];

const socialIcons = [
  {
    src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3d48d7f6da59d5a254d3de86be0679408e0933193b27f6adc685d37f64af0576?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
    alt: 'Social media icon 1',
    url: ''
  },
  {
    src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/3694a02fa1bf48b1f54a51a2a2f11fa0f033b6a018fe49ba4cd65562ae7a5648?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
    alt: 'Social media icon 2',
    url: ''
  }
];

function Header() {
  return (
    <header className='flex flex-col pt-3.5 pb-1 w-full bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.25)] max-md:max-w-full'>
      <div className='flex justify-between items-center w-full max-w-[1380px] mx-auto'>
        <h1 className='text-5xl font-bold text-black border border-white border-solid max-md:text-4xl'>
          YINYANG
        </h1>
        <div className='flex gap-8 items-center'>
          {socialIcons.map((icon, index) => (
            <SocialIcon key={index} src={icon.src} alt={icon.alt} />
          ))}
        </div>
      </div>
      <div className='mt-5 w-full border-black border-solid border-[7px] min-h-[7px] max-md:max-w-full' />
      <nav className='flex gap-10 items-center mt-7 mx-9 text-base font-medium text-zinc-800'>
        {navigationItems.map((item, index) => (
          <NavigationItem key={index} label={item.label} width={item.width} />
        ))}
      </nav>
    </header>
  );
}

export default Header;
