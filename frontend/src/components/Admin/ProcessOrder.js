import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import {
  clearErrors,
  getOrderDetails,
  initiateRefund,
  updateOrder,
  updateRefundStatus
} from '../../actions/orderAction';
import MetaData from '../Layout/MetaData';
import LoadingBar from 'react-top-loading-bar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks,
  faDollarSign,
  faCheckCircle,
  faTimesCircle,
  faBoxOpen,
  faSync
} from '@fortawesome/free-solid-svg-icons';

const ProcessOrder = () => {
  const { order, error, loading } = useSelector(state => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(state => state.order);

  const dispatch = useDispatch();
  const { id } = useParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRefundStatus, setSelectedRefundStatus] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const onLoaderFinished = () => setProgress(0);

  const submitRefundRequest_1 = id => {
    if (order) {
      setProgress(50);
      dispatch(initiateRefund(id));
      toast.success('Refund request initiated successfully');
      handleCloseDialog_1();
    }
  };

  const handleOpenDialog_1 = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog_1 = () => {
    setOpenDialog(false);
  };

  const submitRefundRequest_2 = () => {
    if (order) {
      dispatch(
        updateRefundStatus(order?._id, order?.refund[0], selectedRefundStatus)
      );
      toast.success('Refund status updated successfully');
      handleCloseDialog_2();
    }
  };

  const handleOpenDialog_2 = () => {
    setOpenDialog(true);
    setSelectedRefundStatus(options[4]);
  };

  const handleCloseDialog_2 = () => {
    setOpenDialog(false);
  };

  const updateOrderSubmitHandler = e => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('status', status);
    dispatch(updateOrder(id, status));
  };

  const options = ['Processing', 'Rejected', 'Pending', 'Approved', 'Refunded'];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success('Order Updated Successfully');
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(id));
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
  }, [dispatch, error, id, updateError, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <LoadingBar
          color='red'
          progress={progress}
          onLoaderFinished={onLoaderFinished}
        />
      ) : (
        <Fragment>
          <MetaData title='Update Order Status' />
          <div className='orderDetailsPage p-6'>
            <div className='orderDetailsContainer bg-white p-6 rounded-lg shadow-lg'>
              <h1 className='text-3xl font-bold mb-4'>
                Order #{order && order._id}
              </h1>
              <h2 className='text-xl font-semibold mb-2'>Shipping Info</h2>
              <div className='orderDetailsContainerBox mb-4'>
                <p>
                  <strong>Name:</strong> {order.user && order.user.name}
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  {order.shippingInfo && order.shippingInfo.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong>{' '}
                  {order.shippingInfo &&
                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                </p>
              </div>

              <h2 className='text-xl font-semibold mb-2'>Payment</h2>
              <div className='orderDetailsContainerBox mb-4'>
                <p
                  className={
                    order.paymentInfo &&
                    order.paymentInfo.status === 'succeeded'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.paymentInfo && order.paymentInfo.status === 'succeeded'
                    ? 'PAID'
                    : 'NOT PAID'}
                </p>
                <p>
                  <strong>Amount:</strong> ${order.totalPrice}
                </p>
              </div>

              <h2 className='text-xl font-semibold mb-2'>Order Status</h2>
              <div className='orderDetailsContainerBox mb-4'>
                <p
                  className={
                    order.orderStatus === 'Delivered'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.orderStatus}
                </p>
              </div>

              <div className='returnButtonContainer flex space-x-4'>
                <button
                  className='bg-blue-600 text-white py-2 px-4 rounded'
                  onClick={handleOpenDialog_1}
                  disabled={
                    order.isRefunded === true || order.isReturned === false
                  }
                >
                  <FontAwesomeIcon icon={faSync} /> Initiate Refund
                </button>

                <button
                  className='bg-blue-600 text-white py-2 px-4 rounded'
                  onClick={handleOpenDialog_2}
                  disabled={
                    order.isRefunded === false && order.isReturned === false
                  }
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Approve Refund
                </button>
              </div>

              {/* Refund Dialog 1 */}
              <div
                className={`fixed z-10 inset-0 overflow-y-auto ${openDialog ? 'block' : 'hidden'}`}
              >
                <div className='flex items-center justify-center min-h-screen'>
                  <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-6'>
                    <h2 className='text-xl font-bold mb-4'>
                      Confirm Order Details
                    </h2>
                    {order && order.orderItems && (
                      <div>
                        <p>
                          <strong>Order ID:</strong> {order._id}
                        </p>
                        {order.orderItems.map(item => (
                          <div key={item._id} className='flex mb-4'>
                            <img
                              src={item.image}
                              alt={item.name}
                              className='w-16 h-16 object-contain mr-4'
                            />
                            <div>
                              <p>
                                <strong>Name:</strong> {item.name}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        <p>
                          <strong>Amount:</strong> ${order.totalPrice}
                        </p>
                      </div>
                    )}
                    <div className='flex justify-end space-x-2'>
                      <button
                        onClick={handleCloseDialog_1}
                        className='bg-gray-400 text-white py-2 px-4 rounded'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitRefundRequest_1(id)}
                        className='bg-blue-600 text-white py-2 px-4 rounded'
                      >
                        Initiate Refund
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Dialog 2 */}
              <div
                className={`fixed z-10 inset-0 overflow-y-auto ${openDialog ? 'block' : 'hidden'}`}
              >
                <div className='flex items-center justify-center min-h-screen'>
                  <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-6'>
                    <h2 className='text-xl font-bold mb-4'>
                      Update Refund Status
                    </h2>
                    <div>
                      <p>
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <div className='mt-4'>
                        <label
                          htmlFor='refundStatus'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Refund Status:
                        </label>
                        <select
                          id='refundStatus'
                          className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                          value={selectedRefundStatus}
                          onChange={e =>
                            setSelectedRefundStatus(e.target.value)
                          }
                        >
                          {options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='flex justify-end space-x-2'>
                      <button
                        onClick={handleCloseDialog_2}
                        className='bg-gray-400 text-white py-2 px-4 rounded'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitRefundRequest_2}
                        className='bg-blue-600 text-white py-2 px-4 rounded'
                      >
                        Approve Refund
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className='orderDetailsItems bg-white p-6 rounded-lg shadow-lg'>
              <h2 className='text-2xl font-semibold mb-4'>Order Items</h2>
              <div className='orderDetailsCartItemsContainer'>
                {order.orderItems &&
                  order.orderItems.map(item => (
                    <div className='flex items-center mb-4' key={item.product}>
                      <img
                        src={item.image}
                        alt='Product'
                        className='w-16 h-16 object-contain mr-4'
                      />
                      <div>
                        <Link to={`/product/${item.product}`}>
                          <p className='font-semibold text-lg'>{item.name}</p>
                        </Link>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                        <p>Total: ${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div
                className={`${order.orderStatus === 'Delivered' ? 'hidden' : 'block'}`}
              >
                <form
                  className='updateOrderForm mt-6'
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1 className='text-2xl font-bold mb-4'>Process Order</h1>

                  <div className='flex items-center space-x-2'>
                    <FontAwesomeIcon icon={faTasks} className='text-gray-500' />
                    <select
                      className='border border-gray-300 rounded-md p-2 w-full'
                      onChange={e => setStatus(e.target.value)}
                    >
                      <option value=''>Choose Category</option>
                      {order.orderStatus === 'Processing' && (
                        <option value='Shipped'>Shipped</option>
                      )}
                      {order.orderStatus === 'Shipped' && (
                        <option value='Delivered'>Delivered</option>
                      )}
                    </select>
                  </div>

                  <button
                    type='submit'
                    className='bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full'
                    disabled={loading || status === ''}
                    onClick={() => setProgress(progress + 60)}
                  >
                    Process
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProcessOrder;
