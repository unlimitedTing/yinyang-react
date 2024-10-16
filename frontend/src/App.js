// import Search from './components/Product/Search';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import WebFont from 'webfontloader';

import { loadUser } from './actions/userAction';
import Dashboard from './components/Admin/Dashboard';
import NewProduct from './components/Admin/NewProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from './components/Admin/ProcessOrder';
import ProductList from './components/Admin/ProductList';
import ProductReviews from './components/Admin/ProductReviews';
import RefundList from './components/Admin/RefundList';
import ReturnList from './components/Admin/ReturnList';
import UpdateProduct from './components/Admin/UpdateProduct';
import UpdateUser from './components/Admin/UpdateUser';
import UsersList from './components/Admin/UsersList';
import Cart from './components/Cart/Cart';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import OrderSuccess from './components/Cart/OrderSuccess';
import Payment from './components/Cart/Payment';
import Shipping from './components/Cart/Shipping';
import Home from './components/Home/Home';
import Contact from './components/Layout/Contact/Contact';
import AdminHeader from './components/Layout/Header/AdminHeader';
import MainHeader from './components/Layout/Header/MainHeader';
import NotFound from './components/Layout/Not-Found/NotFound';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import ReturnRequest from './components/Order/ReturnRequest';
import ProductDetails from './components/Product/ProductDetails';
import Products from './components/Product/Products';
import ForgotPassword from './components/User/ForgotPassword';
import Profile from './components/User/Profile';
import ResetPassword from './components/User/ResetPassword';
import UpdatePassword from './components/User/UpdatePassword';
import UpdateProfile from './components/User/UpdateProfile';
import store from './store';

import './App.css';
import PlusMembership from './components/Subscription/PlusMembership';
import PaymentPlusMembership from './components/Subscription/PaymentPlusMembership';
import Wishlist from './components/Product/Wishlist';

import MainFooter from './components/Layout/Footer/MainFooter';
import Login from './components/User/LoginAndRegister';
import AdminRoute from './components/Admin/AdminRoute';

/*
    TODO: #5 Sidebar for Admin Dashboard Not Visible
*/

function App() {
  const { isAuthenticated } = useSelector(state => state.user);
  const strip_secret_key =
    'sk_test_51Q2yOQDy6xKOypJNRMjGMpf7EwAyWZ0XXt0HnC418zImUZky7r29TwKYihLWEMWgo99vA6YIgQS1v4QU8m3mlPOY00hGffiDOz';
  const strip_public_key =
    'pk_test_51Q2yOQDy6xKOypJNx40jMtlDhHd2jAjYtEfjabMcFJaIiS2YKudhnrKJYpZuTjlevYt1sKRPhHRCNGutO9bB6s4V00xDxFPuVi';

  const [stripeApiKey, setStripeApiKey] = useState('');

  const stripePromise = loadStripe(strip_public_key);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  async function getStripeApiKey() {
    setStripeApiKey(strip_public_key);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  window.addEventListener('contextmenu', e => e.preventDefault());

  return (
    <Fragment>
      {!isAdminRoute && <MainHeader />}
      {isAdminRoute && <AdminHeader />}

      {stripeApiKey && (
        <Elements stripe={stripePromise}>
          <Routes>
            {isAuthenticated && (
              <Route path='/payment' element={<Payment />} exact />
            )}
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path='/' element={<Home />} exact />
        <Route path='/product/:id' element={<ProductDetails />} exact />
        <Route path='/products' element={<Products />} exact />
        <Route path='/wishlist' element={<Wishlist />} exact />
        <Route path='/products/:keyword' element={<Products />} exact />
        {/* <Route path='/search' element={<Search />} exact /> */}
        <Route path='/contact-us' element={<Contact />} exact />
        {isAuthenticated && (
          <Route path='/account' element={<Profile />} exact />
        )}
        {isAuthenticated && (
          <Route path='/me/update' element={<UpdateProfile />} exact />
        )}
        {isAuthenticated && (
          <Route path='/password/update' element={<UpdatePassword />} exact />
        )}
        <Route path='/password/forgot' element={<ForgotPassword />} exact />
        <Route
          path='/password/reset/:token'
          element={<ResetPassword />}
          exact
        />
        <Route path='/login' element={<Login />} exact />
        {/* <Route path='/register' element={<Signup />} exact /> */}

        <Route path='/cart' element={<Cart />} exact />
        {isAuthenticated && (
          <Route path='/shipping' element={<Shipping />} exact />
        )}

        {isAuthenticated && (
          <Route path='/success' element={<OrderSuccess />} exact />
        )}

        {isAuthenticated && (
          <Route path='/orders' element={<MyOrders />} exact />
        )}

        {isAuthenticated && (
          <Route path='/order/confirm' element={<ConfirmOrder />} exact />
        )}

        {isAuthenticated && (
          <Route path='/order/:id' element={<OrderDetails />} exact />
        )}

        {isAuthenticated && (
          <Route path='/order/:id/return' element={<ReturnRequest />} exact />
        )}

        {isAuthenticated && (
          <Route
            path='/join/plus-membership'
            element={<PlusMembership />}
            exact
          />
        )}

        {isAuthenticated && (
          <Route
            path='/join/plus-membership/:id/pay'
            element={<PaymentPlusMembership />}
            exact
          />
        )}
      </Routes>
      {/* Admin Routes */}
      <Routes>
        {/* Redirect /admin to /admin/dashboard */}
        <Route
          path='/admin'
          element={<Navigate to='/admin/dashboard' replace />}
        />

        <Route
          path='/admin/dashboard'
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/products'
          element={
            <AdminRoute>
              <ProductList />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/add-product'
          element={
            <AdminRoute>
              <NewProduct />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/product/:id'
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/orders'
          element={
            <AdminRoute>
              <OrderList />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/order/:id'
          element={
            <AdminRoute>
              <ProcessOrder />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <AdminRoute>
              <UsersList />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/user/:id'
          element={
            <AdminRoute>
              <UpdateUser />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/reviews'
          element={
            <AdminRoute>
              <ProductReviews />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/returns'
          element={
            <AdminRoute>
              <ReturnList />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/refunds'
          element={
            <AdminRoute>
              <RefundList />
            </AdminRoute>
          }
        />

        {/* 404 Route for undefined paths
        <Route path='*' element={<NotFound />} /> */}
        {/* 
        <Route
          element={location.pathname === '/payment' ? null : <NotFound />}
        /> */}

        {/* Page Not Found Route */}
        {/* <Route path='/*' element={<NotFound />} /> */}
      </Routes>
      <MainFooter />
    </Fragment>
  );
}

export default App;
