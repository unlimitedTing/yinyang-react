import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { clearErrors, createProduct } from '../../actions/productAction';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import MetaData from '../Layout/MetaData';

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    'Laptop',
    'Mobile',
    'Footwear',
    'Bottom',
    'Tops',
    'Attire',
    'Camera',
    'SmartPhones',
    'Tracksuit',
    'Jeans',
    'Liquor',
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success('Product Created Successfully');
      navigate('/admin/dashboard');
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, navigate, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('price', price);
    myForm.set('description', description);
    myForm.set('category', category);
    myForm.set('Stock', Stock);

    images.forEach((image) => {
      myForm.append('images', image);
    });
    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <form
            className="space-y-6"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1 className="text-2xl font-bold text-gray-700">Create Product</h1>

            <div className="flex items-center border-b border-gray-300 py-2">
              <span className="mr-2">📝</span>
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-3 focus:outline-none"
              />
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <span className="mr-2">💵</span>
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
                className="w-full py-2 px-3 focus:outline-none"
              />
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <span className="mr-2">📜</span>
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="2"
                className="w-full py-2 px-3 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <span className="mr-2">📂</span>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 focus:outline-none"
              >
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center border-b border-gray-300 py-2">
              <span className="mr-2">📦</span>
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
                className="w-full py-2 px-3 focus:outline-none"
              />
            </div>

            <div className="py-2">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {imagesPreview.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Product Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={loading ? true : false}
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
