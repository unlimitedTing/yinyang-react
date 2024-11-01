import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutSteps from '../Cart/CheckoutSteps';
import { useSelector, useDispatch } from 'react-redux';
import MetaData from '../Layout/MetaData';
import { toast } from 'react-toastify';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import api from '../../axiosConfig';
import { createOrder, clearErrors } from '../../actions/orderAction';
import { useNavigate } from 'react-router';
import { FaCreditCard, FaCalendarAlt, FaKey } from 'react-icons/fa';

const PaymentPlusMembership = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const { error } = useSelector(state => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice)
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice
  };

  const submitHandler = async e => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const { data } = await api.post('api/v1/payment', paymentData, config);
      const client_secret = data.clientSecret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country
            }
          }
        }
      });

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status
          };

          dispatch(createOrder(order));
          toast.success('Payment successful');
          navigate('/success');
        } else {
          toast.error("There's some issue while processing payment");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title='Payment' />
      <CheckoutSteps activeStep={2} />
      <div className='container mx-auto p-4'>
        <form
          className='bg-white shadow-md rounded-lg p-6 paymentForm'
          onSubmit={submitHandler}
        >
          <h2 className='text-xl font-semibold mb-4'>Card Info</h2>
          <div className='mb-4'>
            <label className='flex items-center mb-2'>
              <FaCreditCard className='mr-2' />
              Card Number
            </label>
            <CardNumberElement className='border p-2 rounded w-full' />
          </div>
          <div className='mb-4'>
            <label className='flex items-center mb-2'>
              <FaCalendarAlt className='mr-2' />
              Expiry Date
            </label>
            <CardExpiryElement className='border p-2 rounded w-full' />
          </div>
          <div className='mb-4'>
            <label className='flex items-center mb-2'>
              <FaKey className='mr-2' />
              CVC
            </label>
            <CardCvcElement className='border p-2 rounded w-full' />
          </div>
          <button
            type='submit'
            ref={payBtn}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
          >
            Pay - ${orderInfo && orderInfo.totalPrice}
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default PaymentPlusMembership;
