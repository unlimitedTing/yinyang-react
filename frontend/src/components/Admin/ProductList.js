import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  clearErrors,
  deleteProduct,
  getAdminProduct
} from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import MetaData from '../Layout/MetaData';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, products } = useSelector(state => state.products);
  const { error: deleteError, isDeleted } = useSelector(state => state.product);

  const deleteProductHandler = id => {
    dispatch(deleteProduct(id));
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
      toast.success('Product Deleted Successfully');
      navigate('/admin/dashboard');
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProduct());
  }, [dispatch, error, deleteError, navigate, isDeleted]);

  const rows = [];

  products &&
    products.forEach(item => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />
      <div className='productListContainer bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold mb-6'>ALL PRODUCTS</h1>

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white'>
            <thead>
              <tr>
                <th className='py-2'>Product ID</th>
                <th className='py-2'>Name</th>
                <th className='py-2'>Stock</th>
                <th className='py-2'>Price</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td className='py-2'>{row.id}</td>
                  <td className='py-2'>{row.name}</td>
                  <td className='py-2'>{row.stock}</td>
                  <td className='py-2'>${row.price}</td>
                  <td className='py-2 flex justify-center space-x-2'>
                    <Link
                      to={`/admin/product/${row.id}`}
                      className='text-blue-500'
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      onClick={() => deleteProductHandler(row.id)}
                      className='text-red-500'
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
