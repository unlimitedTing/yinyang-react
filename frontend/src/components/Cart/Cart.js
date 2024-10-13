import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import CartItemCard from './CartItemCard';

const Cart = () => {
  const { isAuthenticated } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) return;
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = id => {
    dispatch(removeItemsFromCart(id));
  };

  const checkOutHandler = () => {
    if (!isAuthenticated) navigate('/login');
    else navigate('/shipping');
  };

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-screen text-center'>
          <FontAwesomeIcon
            icon={faTrashAlt}
            size='3x'
            className='text-red-500'
          />
          <h2 className='text-xl font-bold mt-4'>No Product in your Cart</h2>
          <Link to='/products' className='mt-2 text-blue-600 hover:underline'>
            View Products
          </Link>
        </div>
      ) : (
        <Fragment>
          <div className='p-4'>
            <div className='grid grid-cols-3 text-lg font-semibold border-b'>
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            {cartItems.map(item => (
              <div
                key={item.product}
                className='flex items-center justify-between border-b py-4'
              >
                <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                <div className='flex items-center space-x-2'>
                  <button
                    className='bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded'
                    onClick={() =>
                      decreaseQuantity(item.product, item.quantity)
                    }
                  >
                    -
                  </button>
                  <input
                    readOnly
                    type='number'
                    value={item.quantity}
                    className='w-16 text-center border rounded'
                  />
                  <button
                    className='bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded'
                    onClick={() =>
                      increaseQuantity(item.product, item.quantity, item.stock)
                    }
                  >
                    +
                  </button>
                </div>
                <p className='text-lg font-semibold'>{`$${
                  item.price * item.quantity
                }`}</p>
              </div>
            ))}
            <div className='flex justify-between mt-4 font-bold'>
              <div></div>
              <div className='flex items-center space-x-4'>
                <p>Gross Total</p>
                <p>{`$${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div className='checkOutBtn'>
                <button
                  onClick={checkOutHandler}
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
