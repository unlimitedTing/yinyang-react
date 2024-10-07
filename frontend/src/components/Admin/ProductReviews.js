import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, deleteReviews, getAllReviews } from '../../actions/productAction';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import MetaData from '../Layout/MetaData';

const ProductReviews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error: deleteError, isDeleted } = useSelector(state => state.review);
    const { error, reviews, loading } = useSelector(state => state.productReviews);

    const [productId, setProductId] = useState('');

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId, productId));
    };

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllReviews(productId));
    };

    useEffect(() => {
        if (productId.length === 24) {
            toast.info("Review Exists for the entered productId");
            dispatch(getAllReviews(productId));
        }
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success('Review Deleted Successfully');
            navigate('/admin/reviews');
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, error, deleteError, navigate, isDeleted, productId]);

    const columns = [
        { field: 'id', headerName: 'Review ID', minWidth: 200, flex: 0.5 },
        {
            field: 'user',
            headerName: 'User',
            minWidth: 200,
            flex: 0.6
        },
        {
            field: 'comment',
            headerName: 'Comment',
            minWidth: 350,
            flex: 1
        },
        {
            field: 'rating',
            headerName: 'Rating',
            type: 'number',
            minWidth: 180,
            flex: 0.4,
            cellClassName: (params) => {
                return params.getValue(params.id, 'rating') >= 3
                    ? 'text-green-500'
                    : 'text-red-500';
            }
        },
        {
            field: 'actions',
            flex: 0.3,
            headerName: 'Actions',
            minWidth: 150,
            sortable: false,
            renderCell: (params) => (
                <Fragment>
                    <button
                        onClick={() => deleteReviewHandler(params.getValue(params.id, 'id'))}
                        className="text-red-500"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </Fragment>
            )
        }
    ];

    const rows = [];

    reviews &&
        reviews.forEach((item) => {
            rows.push({
                id: item._id,
                rating: item.rating,
                comment: item.comment,
                user: item.name
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL REVIEWS - Admin`} />

            <div className="productReviewsContainer bg-white p-6 rounded-lg shadow-md">
                <form
                    className="productReviewsForm mb-6"
                    onSubmit={productReviewsSubmitHandler}
                >
                    <h1 className="text-3xl font-bold mb-6">ALL REVIEWS</h1>

                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Product Id"
                            required
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded"
                        disabled={loading || productId === ''}
                    >
                        Search
                    </button>
                </form>

                {reviews && reviews.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">Review ID</th>
                                    <th className="py-2 px-4 border">User</th>
                                    <th className="py-2 px-4 border">Comment</th>
                                    <th className="py-2 px-4 border">Rating</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td className="py-2 px-4 border">{row.id}</td>
                                        <td className="py-2 px-4 border">{row.user}</td>
                                        <td className="py-2 px-4 border">{row.comment}</td>
                                        <td className={`py-2 px-4 border ${row.rating >= 3 ? 'text-green-500' : 'text-red-500'}`}>
                                            {row.rating}
                                        </td>
                                        <td className="py-2 px-4 border text-center">
                                            <button
                                                onClick={() => deleteReviewHandler(row.id)}
                                                className="text-red-500"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold">No Reviews Found</h1>
                )}
            </div>
        </Fragment>
    );
};

export default ProductReviews;
