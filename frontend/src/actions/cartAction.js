import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
  CLEAR_CART_ITEMS
} from '../constants/cartConstants';
import api from '../axiosConfig';

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await api.get(`/api/v1/product/${id}`);
  console.log(data);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.Stock,
      quantity
    }
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// REMOVE FROM CART
export const removeItemsFromCart = id => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = data => async dispatch => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data
  });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};

export const clearCart = () => dispatch => {
  dispatch({
    type: CLEAR_CART_ITEMS
  });

  localStorage.removeItem('cartItems');
};
