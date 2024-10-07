import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutSteps from './CheckoutSteps';
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
import axios from 'axios';
import { createOrder, clearErrors } from '../../actions/orderAction';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faCalendar,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import './Payment.css';

const Payment = () => {
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
      const { data } = await axios.post('api/v1/payment', paymentData, config);

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
          toast.error("There's some issue while processing payment ");
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
      <div className='paymentContainer'>
        <form className='paymentForm'>
          <h2 className='text-lg font-bold'>Card Info</h2>
          <div className='mb-4'>
            <FontAwesomeIcon
              icon={faCreditCard}
              className='mr-2 text-gray-600'
            />
            <CardNumberElement className='paymentInput border border-gray-300 rounded-md p-2' />
          </div>
          <div className='mb-4'>
            <FontAwesomeIcon icon={faCalendar} className='mr-2 text-gray-600' />
            <CardExpiryElement className='paymentInput border border-gray-300 rounded-md p-2' />
          </div>
          <div className='mb-4'>
            <FontAwesomeIcon icon={faKey} className='mr-2 text-gray-600' />
            <CardCvcElement className='paymentInput border border-gray-300 rounded-md p-2' />
          </div>

          <input
            type='submit'
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className='paymentFormBtn bg-blue-600 text-white rounded-md p-2 cursor-pointer'
            onClick={submitHandler}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
