import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { clearErrors, myOrders } from '../../actions/orderAction';
import MetaData from '../Layout/MetaData';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './MyOrders.css';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector(state => state.myOrders);
  const { user } = useSelector(state => state.user);
  const [progress, setProgress] = useState(0);

  const onLoaderFinished = () => setProgress(0);
  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.4 },
    {
      field: 'orderStatus',
      headerName: 'Order Status',
      minWidth: 120,
      flex: 0.3,
      cellClassName: params => {
        return params.row.orderStatus === 'Delivered'
          ? 'text-green-500'
          : 'text-red-500';
      }
    },
    {
      field: 'refundStatus',
      headerName: 'Refund Status',
      minWidth: 120,
      flex: 0.3,
      cellClassName: params => {
        const status = params.row.refundStatus;
        return status === 'Approved' || status === 'Refunded'
          ? 'text-green-500'
          : 'text-red-500';
      }
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 120,
      flex: 0.3
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      minWidth: 120,
      flex: 0.2
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      minWidth: 120,
      sortable: false,
      renderCell: params => (
        <Link
          to={`/order/${params.getValue(params.id, 'id')}`}
          className='text-blue-500 hover:text-blue-700'
          onClick={() => setProgress(progress + 80)}
        >
          <FaExternalLinkAlt />
        </Link>
      )
    }
  ];

  const rows = Array.isArray(orders)
    ? orders.map(item => ({
        itemsQty: item.orderItems.length,
        id: item._id,
        orderStatus: item.orderStatus,
        refundStatus: item.refundStatus,
        amount: item.totalPrice
      }))
    : [];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <LoadingBar
          color='red'
          progress={progress}
          onLoaderFinished={onLoaderFinished}
        />
      ) : (
        <div className='myOrdersPage p-4'>
          <h1 id='orderListHeading' className='text-2xl font-bold mb-4'>
            MY ORDERS
          </h1>
          <div className='table-container'>
            <table className='min-w-full bg-white'>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.field} className='border px-4 py-2'>
                      {col.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    {columns.map(col => (
                      <td key={col.field} className='border px-4 py-2'>
                        {row[col.field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 id='myOrdersHeading' className='text-xl mt-4'>
            {user.name}'s Orders
          </h2>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
