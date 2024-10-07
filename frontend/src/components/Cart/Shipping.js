import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Country, State } from 'country-state-city';
import { saveShippingInfo } from '../../actions/cartAction';
import CheckoutSteps from './CheckoutSteps';
import MetaData from '../Layout/MetaData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCity,
  faPhone,
  faMapPin,
  faGlobe,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import './Shipping.css';

const Shipping = () => {
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector(state => state.cart);
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber);

  const shippingSubmit = e => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      toast.error('Phone Number should be 10 digits long');
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNumber })
    );
    navigate('/order/confirm');
  };

  return (
    <Fragment>
      <MetaData title='Shipping Details' />
      <CheckoutSteps activeStep={0} />
      <div className='shippingContainer'>
        <div className='shippingBox'>
          <h2 className='shippingHeading text-xl font-bold'>
            Shipping Details
          </h2>
          <form className='shippingForm' onSubmit={shippingSubmit}>
            <div className='mb-4'>
              <FontAwesomeIcon icon={faHome} className='mr-2 text-gray-600' />
              <input
                type='text'
                placeholder='Address'
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div className='mb-4'>
              <FontAwesomeIcon icon={faCity} className='mr-2 text-gray-600' />
              <input
                type='text'
                placeholder='City'
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div className='mb-4'>
              <FontAwesomeIcon icon={faMapPin} className='mr-2 text-gray-600' />
              <input
                type='text'
                placeholder='PinCode'
                required
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div className='mb-4'>
              <FontAwesomeIcon icon={faPhone} className='mr-2 text-gray-600' />
              <input
                type='text'
                placeholder='Phone Number'
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full'
              />
            </div>
            <div className='mb-4'>
              <FontAwesomeIcon icon={faGlobe} className='mr-2 text-gray-600' />
              <select
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className='border border-gray-300 rounded-md p-2 w-full'
              >
                <option value=''>Country</option>
                {Country &&
                  Country.getAllCountries().map(item => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div className='mb-4'>
                <FontAwesomeIcon
                  icon={faExchangeAlt}
                  className='mr-2 text-gray-600'
                />
                <select
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className='border border-gray-300 rounded-md p-2 w-full'
                >
                  <option value=''>State</option>
                  {State &&
                    State.getStatesOfCountry(country).map(item => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type='submit'
              value='Continue'
              className='shippingBtn bg-blue-600 text-white rounded-md p-2 cursor-pointer'
              disabled={!state}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
