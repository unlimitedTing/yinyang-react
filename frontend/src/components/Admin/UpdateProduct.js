import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faMoneyBillWave, faFileAlt, faBoxes, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { clearErrors, getProductDetails, updateProduct } from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import MetaData from '../Layout/MetaData';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { error, product } = useSelector(state => state.productDetails);

    const {
        loading,
        error: updateError,
        isUpdated
    } = useSelector(state => state.product);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        'Laptop',
        'Footwear',
        'Bottom',
        'Tops',
        'Attire',
        'Camera',
        'SmartPhones',
        'Jeans'
    ];

    const productId = id;

    useEffect(() => {
        if (product && product._id !== productId) {
            dispatch(getProductDetails(productId));
        } else {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.Stock);
            setOldImages(product.images);
        }
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (updateError) {
            toast.error(updateError);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('Product Updated Successfully');
            navigate('/admin/products');
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }
    }, [
        dispatch,
        error,
        navigate,
        isUpdated,
        productId,
        product,
        updateError
    ]);

    const updateProductSubmitHandler = e => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('Stock', Stock);

        images.forEach(image => {
            myForm.append('images', image);
        });
        dispatch(updateProduct(productId, myForm));
    };

    const updateProductImagesChange = e => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(old => [...old, reader.result]);
                    setImages(old => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    return (
        <Fragment>
            <MetaData title='Update Product' />
            <div className='newProductContainer'>
                <form
                    className='createProductForm'
                    encType='multipart/form-data'
                    onSubmit={updateProductSubmitHandler}
                >
                    <h1 className='text-3xl mb-6 font-bold text-gray-700'>Update Product</h1>

                    <div className='flex items-center mb-4'>
                        <FontAwesomeIcon icon={faTags} className='mr-2' />
                        <input
                            type='text'
                            placeholder='Product Name'
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className='p-2 border rounded w-full'
                        />
                    </div>

                    <div className='flex items-center mb-4'>
                        <FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' />
                        <input
                            type='number'
                            placeholder='Price'
                            required
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className='p-2 border rounded w-full'
                        />
                    </div>

                    <div className='flex items-center mb-4'>
                        <FontAwesomeIcon icon={faFileAlt} className='mr-2' />
                        <textarea
                            placeholder='Product Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            cols='30'
                            rows='1'
                            className='p-2 border rounded w-full'
                        ></textarea>
                    </div>

                    <div className='flex items-center mb-4'>
                        <FontAwesomeIcon icon={faLayerGroup} className='mr-2' />
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className='p-2 border rounded w-full'
                        >
                            <option value=''>Choose Category</option>
                            {categories.map(cate => (
                                <option key={cate} value={cate}>
                                    {cate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='flex items-center mb-4'>
                        <FontAwesomeIcon icon={faBoxes} className='mr-2' />
                        <input
                            type='number'
                            placeholder='Stock'
                            required
                            value={Stock}
                            onChange={e => setStock(e.target.value)}
                            className='p-2 border rounded w-full'
                        />
                    </div>

                    <div id='createProductFormFile' className='mb-4'>
                        <input
                            type='file'
                            name='avatar'
                            accept='image/*'
                            onChange={updateProductImagesChange}
                            multiple
                            className='p-2 border rounded w-full'
                        />
                    </div>

                    <div id='createProductFormImage' className='mb-4'>
                        {oldImages &&
                            oldImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt='Old Product Preview'
                                    className='w-32 h-32 object-cover mr-2'
                                />
                            ))}
                    </div>

                    <div id='createProductFormImage' className='mb-4'>
                        {imagesPreview.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt='Product Preview'
                                className='w-32 h-32 object-cover mr-2'
                            />
                        ))}
                    </div>

                    <button
                        type='submit'
                        disabled={loading ? true : false}
                        className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                    >
                        Update Product
                    </button>
                </form>
            </div>
        </Fragment>
    );
};

export default UpdateProduct;
