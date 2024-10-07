import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
  clearErrors,
  getOrderDetails,
  returnRequest
} from '../../actions/orderAction';
import LoadingBar from 'react-top-loading-bar';
import MetaData from '../Layout/MetaData';

const OrderDetails = () => {
  const { order, error, loading } = useSelector(state => state.orderDetails);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [progress, setProgress] = useState(0);

  const returnReasons = [
    'Defective Product',
    'Wrong Product Shipped',
    'Received Incomplete Order',
    "Product Doesn't Match Description",
    'Size Does Not Fit',
    "Color Doesn't Match",
    'Changed My Mind',
    'Item Arrived Late',
    'Ordered by Mistake',
    'Unsatisfactory Quality',
    'Received Damaged Product',
    'Ordered Duplicate Product',
    'Product Expired/Short Expiry Date',
    'Not Satisfied with Performance',
    "Item Doesn't Meet Expectations"
  ];

  const submitReturnRequest = () => {
    if (selectedReturnReason) {
      dispatch(returnRequest(order._id, selectedReturnReason));
      toast.success('Return request submitted successfully');
      handleCloseDialog();
    }
    setProgress(progress + 80);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setSelectedReturnReason(returnReasons[0]);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, error, id]);

  return (
    <Fragment>
      {loading ? (
        <LoadingBar
          color='red'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      ) : (
        <Fragment>
          <MetaData title='Order Details' />
          <div className='p-4'>
            <div className='bg-white shadow-md rounded-lg p-6'>
              <h2 className='text-xl font-semibold'>Order #{order?._id}</h2>
              <h3 className='mt-4 text-lg'>Shipping Info</h3>
              <div className='mb-4'>
                <p>
                  Name: <span>{order.user?.name}</span>
                </p>
                <p>
                  Phone: <span>{order.shippingInfo?.phoneNumber}</span>
                </p>
                <p>
                  Address:{' '}
                  <span>{`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state}, ${order.shippingInfo?.pinCode}, ${order.shippingInfo?.country}`}</span>
                </p>
              </div>
              <h3 className='text-lg'>Payment</h3>
              <div className='mb-4'>
                <p
                  className={
                    order.paymentInfo?.status === 'succeeded'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.paymentInfo?.status === 'succeeded'
                    ? 'PAID'
                    : 'NOT PAID'}
                </p>
                <p>Amount: ₹{order.totalPrice}</p>
              </div>
              <h3 className='text-lg'>Order Status</h3>
              <p
                className={
                  order.orderStatus === 'Delivered'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {order.orderStatus}
              </p>
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded mt-4'
                onClick={handleOpenDialog}
                disabled={
                  order.isReturned ||
                  ['Processing', 'Shipped'].includes(order.orderStatus)
                }
              >
                Return
              </button>
              {openDialog && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
                  <div className='bg-white rounded-lg p-6 max-w-md w-full'>
                    <h3 className='text-lg font-semibold'>
                      Confirm Order Details
                    </h3>
                    <div className='mt-4'>
                      <p>Order ID: {order._id}</p>
                      <div className='flex flex-wrap mt-2'>
                        {order.orderItems &&
                          order.orderItems.map(item => (
                            <div
                              key={item._id}
                              className='flex items-center my-4 mr-4'
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className='w-16 h-16 object-cover mr-2'
                              />
                              <div>
                                <p>{item.name}</p>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                      <p>Select reason for return:</p>
                      <select
                        value={selectedReturnReason}
                        onChange={e => setSelectedReturnReason(e.target.value)}
                        className='w-full border rounded mt-2 p-2'
                      >
                        {returnReasons.map(reason => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='flex justify-end mt-4'>
                      <button
                        onClick={handleCloseDialog}
                        className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitReturnRequest}
                        className='bg-blue-600 text-white px-4 py-2 rounded'
                      >
                        Return
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='mt-8'>
              <h3 className='text-lg font-semibold'>Order Items:</h3>
              <div className='overflow-y-auto max-h-60'>
                {order.orderItems?.map(item => (
                  <div
                    className='flex items-center border-b py-4'
                    key={item.product}
                  >
                    <div className='w-1/4'>
                      {item.images.length > 1 ? (
                        <Carousel showThumbs={false}>
                          {item.images.map((img, index) => (
                            <div key={index}>
                              <img src={img.url} alt={`Product ${index + 1}`} />
                            </div>
                          ))}
                        </Carousel>
                      ) : (
                        <img src={item.images[0].url} alt='Product' />
                      )}
                    </div>
                    <div className='w-3/4 pl-4'>
                      <Link to={`/product/${item.product}`}>
                        <p className='font-semibold'>{item.name}</p>
                      </Link>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                      <p>Total: ₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
