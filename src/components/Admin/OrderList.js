import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { clearErrors, deleteOrder, getAllOrders, updateRefundStatus } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import MetaData from '../Layout/MetaData';

const OrderList = ({ orderId, refundId, refundStatus }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRefundStatus, setSelectedRefundStatus] = useState('');
    const [clickedOrder, setClickedOrder] = useState(null);

    const { error, orders } = useSelector(state => state.allOrders);
    const { error: deleteError, isDeleted } = useSelector(state => state.order);

    const deleteOrderHandler = id => {
        dispatch(deleteOrder(id));
    };

    const handleRefundClick = refundStatus => {
        dispatch(updateRefundStatus(orderId, refundId, refundStatus));
        handleCloseDialog();
    };

    const handleOpenDialog = order => {
        setOpenDialog(true);
        setSelectedRefundStatus(order.refundStatus);
        setClickedOrder(order);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success('Order Deleted Successfully');
            navigate('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET });
        }

        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, navigate, isDeleted]);

    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 160, flex: 0.6 },
        {
            field: 'name',
            headerName: 'Product Name',
            minWidth: 150,
            flex: 0.5
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            flex: 0.5,
            cellClassName: params => {
                return params.getValue(params.id, 'status') === 'Delivered'
                    ? 'text-green-600'
                    : 'text-red-600';
            }
        },
        {
            field: 'refundStatus',
            headerName: 'Refund Status',
            minWidth: 100,
            flex: 0.45,
            cellClassName: params => {
                const status = params.row.refundStatus;
                return status === 'Approved' || status === 'Refunded'
                    ? 'text-green-600'
                    : status === 'Initiated' ||
                      status === 'Pending' ||
                      status === 'Rejected' ||
                      status === 'Processing'
                    ? 'text-red-600'
                    : '';
            }
        },
        {
            field: 'itemsQty',
            headerName: 'Items Qty',
            type: 'number',
            minWidth: 120,
            flex: 0.4
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            minWidth: 120,
            flex: 0.4
        },
        {
            field: 'actions',
            flex: 0.3,
            headerName: 'Actions',
            minWidth: 150,
            type: 'number',
            sortable: false,
            renderCell: params => {
                return (
                    <Fragment>
                        <Link
                            to={`/admin/order/${params.getValue(
                                params.id,
                                'id'
                            )}`}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ✏️ {/* Edit icon as emoji */}
                        </Link>

                        <button
                            onClick={() =>
                                deleteOrderHandler(
                                    params.getValue(params.id, 'id')
                                )
                            }
                            className="text-red-600 hover:text-red-800 ml-2"
                        >
                            🗑️ {/* Delete icon as emoji */}
                        </button>
                    </Fragment>
                );
            }
        },
    ];

    const rows = [];

    orders &&
        orders.forEach(item => {
            rows.push({
                id: item._id,
                name: item.orderItems[0].name,
                itemsQty: item.orderItems.length,
                amount: item.totalPrice,
                status: item.orderStatus,
                refundStatus: item.refundStatus,
                isReturned: item.isReturned
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL ORDERS - Admin`} />

            <div className='container mx-auto px-4 py-6'>
                <h1 className='text-3xl font-bold text-gray-800 mb-4'>ALL ORDERS</h1>

                <div className="bg-white shadow-md rounded my-6">
                    <table className="min-w-full bg-white">
                        {/* Table Header */}
                        <thead>
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="py-3 px-5 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.headerName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* Table Rows */}
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index} className="border-t">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="py-3 px-5 text-sm">
                                            {column.field === 'actions' ? (
                                                column.renderCell({ id: row.id })
                                            ) : (
                                                row[column.field]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {openDialog && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                                <h2 className="text-lg font-semibold">Change Refund Status</h2>

                                <div className="mt-4">
                                    <p className="text-sm font-medium">Order Details:</p>
                                    {orders && clickedOrder && (
                                        <div className="mt-2">
                                            <p className="text-sm">Order ID: {clickedOrder.id}</p>
                                            <div className="flex space-x-4">
                                                {clickedOrder.orderItems.map(item => (
                                                    <div key={item._id}>
                                                        <img
                                                            src={item.image}
                                                            alt="Product"
                                                            className="w-20 h-20 object-cover"
                                                        />
                                                        <p className="text-sm">{item.name}</p>
                                                        <p className="text-sm">Quantity: {item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm">Amount: {clickedOrder.totalPrice}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm font-medium">Select Refund Status:</p>
                                    <select
                                        value={selectedRefundStatus}
                                        onChange={e => setSelectedRefundStatus(e.target.value)}
                                        className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="Initiated">Initiated</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Refunded">Refunded</option>
                                    </select>
                                </div>

                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        onClick={handleCloseDialog}
                                        className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleRefundClick(selectedRefundStatus)}
                                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default OrderList;
