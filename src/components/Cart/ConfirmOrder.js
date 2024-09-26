import React, { Fragment, useEffect, useState } from 'react';
import CheckoutSteps from '../Cart/CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../Layout/MetaData';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCoupons } from '../../actions/couponAction';

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const { coupons } = useSelector(state => state.coupon);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 150;

  const selectedCouponValue = selectedCoupon ? selectedCoupon.discount : 0;
  const couponDiscountAmount = (subtotal * selectedCouponValue) / 100;
  const totalPrice = subtotal + shippingCharges - couponDiscountAmount;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      totalPrice,
      selectedCoupon
    };

    sessionStorage.setItem('orderInfo', JSON.stringify(data));
    navigate('/payment');
  };

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  return (
    <Fragment>
      <MetaData title='Confirm Order' />
      <CheckoutSteps activeStep={1} />
      <div className='flex flex-col md:flex-row md:justify-between p-4'>
        <div className='w-full md:w-2/3'>
          <div className='bg-gray-100 p-4 rounded-lg mb-4'>
            <h2 className='text-lg font-bold'>Shipping Info</h2>
            <div className='mt-2'>
              <p>
                Name: <span className='font-semibold'>{user.name}</span>
              </p>
              <p>
                Phone:{' '}
                <span className='font-semibold'>
                  {shippingInfo.phoneNumber}
                </span>
              </p>
              <p>
                Address: <span className='font-semibold'>{address}</span>
              </p>
            </div>
          </div>
          <div className='bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-lg font-bold'>Your Cart Items:</h2>
            <div className='mt-2'>
              {cartItems.map(item => (
                <div key={item.product} className='flex items-center mb-2'>
                  <img
                    src={item.image}
                    alt='Product'
                    className='w-20 h-20 mr-4'
                  />
                  <Link
                    to={`/product/${item.product}`}
                    className='text-blue-600 hover:underline'
                  >
                    {item.name}
                  </Link>
                  <span className='ml-4'>
                    {item.quantity} x ₹{item.price} ={' '}
                    <b>₹{item.price * item.quantity}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full md:w-1/3 mt-4 md:mt-0'>
          <div className='bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-lg font-bold'>Order Summary</h2>
            <div className='mt-2'>
              <p>
                Subtotal: <span className='font-semibold'>₹{subtotal}</span>
              </p>
              <p>
                Shipping Charges:{' '}
                <span className='font-semibold'>₹{shippingCharges}</span>
              </p>
              <div className='mt-2'>
                <label className='block'>Select Coupon:</label>
                <select
                  onChange={e => {
                    const selectedCouponId = e.target.value;
                    const selectedCouponObj = coupons.find(
                      coupon => coupon._id === selectedCouponId
                    );
                    setSelectedCoupon(selectedCouponObj);
                  }}
                  className='border border-gray-300 rounded p-1'
                >
                  <option value={null}>No Coupon</option>
                  {coupons.map(coupon => (
                    <option key={coupon._id} value={coupon._id}>
                      {`${coupon.code} - ${coupon.discount}%`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='mt-4'>
              <p>
                <b>Total:</b>{' '}
                <span className='font-semibold'>₹{totalPrice}</span>
              </p>
            </div>
            <button
              onClick={proceedToPayment}
              className='mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
            >
              Proceed To Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
