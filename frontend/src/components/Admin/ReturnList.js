import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { clearErrors, allReturns } from '../../actions/orderAction';
import LoadingBar from 'react-top-loading-bar';
import MetaData from '../Layout/MetaData';

const ReturnList = () => {
    const dispatch = useDispatch();

    const { loading, error, returns } = useSelector(state => state.allReturns);
    const [progress, setProgress] = useState(0);

    const onLoaderFinished = () => setProgress(0);

    const columns = [
        { field: 'id', headerName: 'Return ID', minWidth: 150, flex: 0.4 },
        { field: 'orderID', headerName: 'Order ID', minWidth: 150, flex: 0.4 },
        { field: 'productID', headerName: 'Product ID', minWidth: 150, flex: 0.4 },
        { field: 'customer', headerName: 'Customer', minWidth: 110, flex: 0.4 },
        { field: 'returnReason', headerName: 'Return Reason', minWidth: 200, flex: 0.5 },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            flex: 0.4,
            cellClassName: params => {
                const status = params.row.status;
                return status === 'Completed' ? 'text-green-500' : 'text-red-500';
            }
        },
        { field: 'requestDate', headerName: 'Request Date', type: 'date', minWidth: 130, flex: 0.5 },
        { field: 'refundAmount', headerName: 'Refund Amount', type: 'number', minWidth: 150, flex: 0.5 },
        {
            field: 'actions',
            flex: 0.2,
            headerName: 'Actions',
            minWidth: 120,
            sortable: false,
            renderCell: params => {
                const orderId = params.row.orderID;
                return (
                    <div className='text-blue-500'>
                        <Link to={`/order/${orderId}`}>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </Link>
                    </div>
                );
            }
        }
    ];

    const rows = [];

    returns && returns.forEach((item, index) => {
        let productIds;
        if (Array.isArray(item.products) && item.products.length > 1) {
            productIds = (
                <select>
                    {item.products.map(productObj => (
                        <option key={productObj._id} value={productObj._id}>
                            {productObj.product}
                        </option>
                    ))}
                </select>
            ).toString();
        } else {
            productIds = item.products[0].product;
        }

        rows.push({
            id: item._id,
            orderID: item.order._id,
            productID: productIds.toString(),
            customer: item.order.user.name,
            returnReason: item.reason,
            status: item.status,
            requestDate: item.requestedAt,
            refundAmount: item.order.totalPrice
        });
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        dispatch(allReturns());
        setProgress(100);
        setTimeout(() => setProgress(0), 5000);
    }, [dispatch, error]);

    return (
        <Fragment>
            <MetaData title='All Returns' />
            {loading ? (
                <LoadingBar color='red' progress={progress} onLoaderFinished={onLoaderFinished} />
            ) : (
                <div className='p-6 bg-white shadow-md rounded-lg'>
                    <h1 className='text-2xl font-bold mb-6'>ALL RETURNS</h1>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white'>
                            <thead>
                                <tr>
                                    <th className='py-2 px-4 border'>Return ID</th>
                                    <th className='py-2 px-4 border'>Order ID</th>
                                    <th className='py-2 px-4 border'>Product ID</th>
                                    <th className='py-2 px-4 border'>Customer</th>
                                    <th className='py-2 px-4 border'>Return Reason</th>
                                    <th className='py-2 px-4 border'>Status</th>
                                    <th className='py-2 px-4 border'>Request Date</th>
                                    <th className='py-2 px-4 border'>Refund Amount</th>
                                    <th className='py-2 px-4 border'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.id}>
                                        <td className='py-2 px-4 border'>{row.id}</td>
                                        <td className='py-2 px-4 border'>{row.orderID}</td>
                                        <td className='py-2 px-4 border'>{row.productID}</td>
                                        <td className='py-2 px-4 border'>{row.customer}</td>
                                        <td className='py-2 px-4 border'>{row.returnReason}</td>
                                        <td className={`py-2 px-4 border ${row.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}>
                                            {row.status}
                                        </td>
                                        <td className='py-2 px-4 border'>{row.requestDate}</td>
                                        <td className='py-2 px-4 border'>{row.refundAmount}</td>
                                        <td className='py-2 px-4 border'>
                                            <Link to={`/order/${row.id}`} className='text-blue-500'>
                                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default ReturnList;
