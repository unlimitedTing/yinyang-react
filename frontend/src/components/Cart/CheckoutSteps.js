import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShippingFast,
  faCheckCircle,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: 'Shipping Details',
      icon: <FontAwesomeIcon icon={faShippingFast} className='text-xl' />
    },
    {
      label: 'Confirm Order',
      icon: <FontAwesomeIcon icon={faCheckCircle} className='text-xl' />
    },
    {
      label: 'Payment',
      icon: <FontAwesomeIcon icon={faDollarSign} className='text-xl' />
    }
  ];

  return (
    <Fragment>
      <div className='flex justify-between mb-6'>
        {steps.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center ${
              activeStep >= index ? 'text-blue-700' : 'text-gray-500'
            }`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border ${
                activeStep >= index
                  ? 'border-blue-700 bg-blue-100'
                  : 'border-gray-300'
              }`}
            >
              {item.icon}
            </div>
            <span className={`mt-2 ${activeStep >= index ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        {steps.map((item, index) => (
          <div
            key={index}
            className={`flex-1 h-1 ${
              activeStep > index ? 'bg-blue-700' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </Fragment>
  );
};

export default CheckoutSteps;
