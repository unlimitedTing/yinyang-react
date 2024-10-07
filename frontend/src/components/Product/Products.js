import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { clearErrors, getProduct } from '../../actions/productAction';
import ProductCard from '../Home/ProductCard';
import MetaData from '../Layout/MetaData';
import ProductGridItem from './ProductGridItem';

const Products = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 40000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { keyword } = useParams();
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount
  } = useSelector(state => state.products);

  const setCurrentPageNo = e => {
    setCurrentPage(e);
  };

  const getUniqueCategories = dummyProducts => {
    const categoriesSet = new Set();
    dummyProducts.forEach(product => {
      categoriesSet.add(product.category);
    });
    return Array.from(categoriesSet);
  };

  const priceRanges = [
    [
      { key: 'range1', label: '0 - 1000', value: [0, 1000] },
      { key: 'range2', label: '1000 - 2500', value: [1000, 2500] }
    ],
    [
      { key: 'range3', label: '2500 - 5000', value: [2500, 5000] },
      { key: 'range4', label: '5000+', value: [5000, 400000] }
    ]
  ];

  const priceHandler = (event, newPrice) => {
    if (price[0] === newPrice[0] && price[1] === newPrice[1]) {
      setPrice([0, 400000]);
    } else {
      setPrice(newPrice);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

  let count = filteredProductsCount;

  const dummyProducts = [
    {
      id: '1',
      name: 'Silver Ring',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$280.90',
      sizes: ['S', 'M', 'L'],
      category: 'Category 2',
      rating: 4.0,
      images: [
        {
          url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
        }
      ],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    },
    {
      id: '2',
      name: 'Gemstone Bracelet',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$680.90',
      sizes: ['S', 'M', 'L'],
      category: 'Category 1',
      rating: 4.0,
      images: [
        {
          url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/31b69bfee0eac0dfc09e08e8a402b9339c0fd0915058c81a216a854851824ca9?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
        }
      ],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/31b69bfee0eac0dfc09e08e8a402b9339c0fd0915058c81a216a854851824ca9?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    },
    {
      id: '3',
      name: 'Silver Ring',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$280.90',
      sizes: ['S', 'M', 'L'],
      category: 'Category 2',
      rating: 4.0,
      images: [
        {
          url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
        }
      ],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    },
    {
      id: '4',
      name: 'Gemstone Bracelet',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$680.90',
      sizes: ['S', 'M', 'L'],
      category: 'Category 1',
      rating: 4.0,
      images: [
        {
          url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/31b69bfee0eac0dfc09e08e8a402b9339c0fd0915058c81a216a854851824ca9?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
        }
      ],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/31b69bfee0eac0dfc09e08e8a402b9339c0fd0915058c81a216a854851824ca9?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    },
    {
      id: '5',
      name: 'Silver Ring',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$280.90',
      sizes: ['S', 'M', 'L'],
      category: 'Category 2',
      rating: 4.0,
      images: [
        {
          url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
        }
      ],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    },
    {
      id: '6',
      name: 'Gemstone Bracelet',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$680.90',
      sizes: ['S', 'M', 'L'],
      category: 'Category 1',
      rating: 4.0,
      images: [
        {
          url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/31b69bfee0eac0dfc09e08e8a402b9339c0fd0915058c81a216a854851824ca9?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
        }
      ],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/31b69bfee0eac0dfc09e08e8a402b9339c0fd0915058c81a216a854851824ca9?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    }
  ];
  return (
    <Fragment>
      {loading ? (
        <LoadingBar
          color='red'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      ) : (
        <Fragment>
          <h2 className='text-2xl font-bold my-4'>All Products</h2>
          <div className='flex'>
            {/* Filters Section */}
            <div className='w-1/6 p-4 bg-gray-100 rounded-md shadow-md'>
              <h3 className='text-lg font-semibold'>Filters</h3>
              <div className='mb-4'>
                <h4 className='text-md'>Price</h4>
                <div className='flex flex-col'>
                  {priceRanges.map((rangeLine, lineIndex) => (
                    <div
                      key={`line_${lineIndex}`}
                      className='flex flex-col mb-2'
                    >
                      {rangeLine.map(range => (
                        <button
                          key={range.key}
                          className={`px-4 py-2 border rounded-md ${
                            price[0] === range.value[0] &&
                            price[1] === range.value[1]
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-black'
                          }`}
                          onClick={() => priceHandler(null, range.value)}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <h4 className='text-md'>Categories</h4>
              <div className='flex flex-col mb-4'>
                {getUniqueCategories(dummyProducts).map(category => (
                  <button
                    className={`px-4 py-2 border rounded-md mb-1 cursor-pointer hover:bg-blue-500 hover:text-white ${
                      category === selectedCategory
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-black'
                    }`}
                    key={category}
                    onClick={() => setCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <h4 className='text-md'>Ratings Above</h4>
              <div className='flex flex-col mb-4'>
                {Array.from({ length: 6 }, (_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md mb-1 cursor-pointer hover:bg-blue-500 hover:text-white ${
                      ratings === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-black'
                    }`}
                    onClick={() => setRatings(index)}
                  >
                    {index} {index === 1 ? 'Star' : 'Stars'}
                  </button>
                ))}
              </div>

              <input
                type='range'
                min={0}
                max={5}
                value={ratings}
                onChange={e => setRatings(e.target.value)}
                className='w-full'
              />
            </div>

            {/* Products Section */}
            <div className='w-3/4 p-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {dummyProducts &&
                  dummyProducts.map(product => (
                    <ProductGridItem key={product.id} product={product} />
                  ))}
              </div>

              {resultPerPage < filteredProductsCount && (
                <div className='flex justify-center'>
                  <nav>
                    <ul className='flex space-x-2'>
                      {[
                        ...Array(
                          Math.ceil(productsCount / resultPerPage)
                        ).keys()
                      ].map(number => (
                        <li key={number}>
                          <button
                            className={`px-3 py-1 border rounded-md ${
                              currentPage === number + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-black'
                            }`}
                            onClick={() => setCurrentPageNo(number + 1)}
                          >
                            {number + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
