import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { clearErrors, getProduct } from '../../actions/productAction';
import { clearNewsletter, newsletter } from '../../actions/subscribeAction';
import LoadingBar from 'react-top-loading-bar';

import ProductCard from './ProductCard';

import './Home.css';

const Home = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);

  const onLoaderFinished = () => setProgress(0);

  const { loading, error } = useSelector(state => state.products);
  const { success: subscribeSuccess, error: subscribeError } = useSelector(
    state => state.subscribe
  );

  const submitSubscribeHandler = e => {
    e.preventDefault();
    dispatch(newsletter(email));
    setEmail('');
    setProgress(50);
  };

  useEffect(() => {
    if (subscribeSuccess) {
      toast.success("You've successfully subscribed to our newsletter");
      dispatch(clearNewsletter());
    }

    if (subscribeError) {
      toast.error("You've already subscribed to our newsletter");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 5000);

    dispatch(getProduct());
  }, [dispatch, error, subscribeSuccess, subscribeError]);

  const products = [
    {
      title: 'Silver Ring',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$280.90',
      sizes: ['S', 'M', 'L'],
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/de85919a47b137ba4a7ac34606944003414f41702edacf80ef7c795a37aaddd3?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
    },
    {
      title: 'Gemstone Bracelet',
      description:
        'Lorem ipsum dolor sit amet consectetur. Dolor et volutpat in non. Luctus sit libero urna viverra sed non dui elementum Dolor et volutpat in non. Luctus sit libero urna viverra .',
      price: '$680.90',
      sizes: ['S', 'M', 'L'],
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
          onLoaderFinished={onLoaderFinished}
        />
      ) : (
        <Fragment>
          <main className='relative flex flex-col items-end px-20 pt-28 pb-20 w-full font-bold text-white min-h-[655px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5 max-md:pt-24 max-md:max-w-full'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/840a6c464625ef2007cb08e8eff767a28df42dad465ce9786336a7c0f9444482?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
              alt=''
              className='object-cover absolute inset-0 size-full'
            />
            <section className='relative flex flex-col items-start max-w-full w-[419px]'>
              <div className='text-lg'>25 - 30 December</div>
              <h1 className='self-stretch mt-4 text-9xl leading-[95px] max-md:text-4xl max-md:leading-9'>
                BLACK <br /> FRIDAY
              </h1>
              <p className='z-10 mt-0 text-5xl font-semibold leading-[95px] text-white text-opacity-90 max-md:text-4xl max-md:leading-[84px]'>
                UP TO
              </p>
              <div className='text-9xl leading-none text-white text-opacity-90 max-md:text-4xl'>
                <span className='text-9xl text-white'>40</span>
                <span className='text-white'>%</span>
              </div>
              <div className='flex gap-px mt-8 text-base font-medium'>
                <div className='grow'>
                  Off <br />
                </div>
                <img
                  loading='lazy'
                  src='https://cdn.builder.io/api/v1/image/assets/TEMP/9b02a1f50fb1087cc0265749956cfc65f6384cc2d694bb8ea894bdcd90c18cec?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
                  alt=''
                  className='object-contain shrink-0 self-start mt-1 aspect-square w-[18px]'
                />
              </div>
            </section>
          </main>
          <main className='self-center w-full max-md:max-w-full px-4'>
            {' '}
            {/* Add horizontal padding */}
            <div className='flex gap-5 max-md:flex-col justify-center'>
              {' '}
              {/* Add justify-center to center */}
              <section className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'>
                <div className='flex z-10 flex-col items-start w-full max-md:mr-0 max-md:max-w-full'>
                  <img
                    loading='lazy'
                    src='https://cdn.builder.io/api/v1/image/assets/TEMP/59158c72e2e0352cf2a34591da5ef66663e64e180574de0c60962a4c7394d3b4?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
                    alt='Jewelry illustration'
                    className='object-contain z-10 max-w-full aspect-[1.07] w-[510px]'
                  />
                  <h1 className='self-stretch text-7xl font-medium text-black leading-[105px] max-md:max-w-full max-md:text-4xl max-md:leading-[58px]'>
                    Jewelry tells eternal stories
                  </h1>
                  <div className='mt-11 max-w-full w-[559px] max-md:mt-10'>
                    <div className='flex gap-5 max-md:flex-col'>
                      <div className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'>
                        <div className='flex flex-col grow font-medium max-md:mt-10'>
                          <h2 className='self-start text-4xl text-black'>
                            Gemstone
                          </h2>
                          <p className='mt-5 text-base leading-8 text-neutral-700'>
                            Lorem ipsum dolor sit amet consectetur. Dolor et
                            volutpat
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'>
                        <div className='flex flex-col grow font-medium max-md:mt-10'>
                          <h2 className='self-start text-4xl text-black'>
                            Silver
                          </h2>
                          <p className='mt-5 text-base leading-8 text-neutral-700'>
                            Lorem ipsum dolor sit amet consectetur. Dolor et
                            volutpat
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className='flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col grow mt-20 font-medium max-md:mt-10 max-md:max-w-full'>
                  <div className='flex flex-col px-16 max-md:px-5 max-md:max-w-full'>
                    <h2 className='self-start text-4xl text-black'>
                      Our Story
                    </h2>
                    <p className='mt-9 text-base leading-8 text-neutral-700 max-md:max-w-full'>
                      Lorem ipsum dolor sit amet consectetur. Dolor et volutpat
                      in non. Luctus sit libero urna viverra sed non dui
                      elementum quam. Enim ipsum amet sed ultrices amet
                      adipiscing. Eget a molestie parturient erat fringilla.
                    </p>
                  </div>
                  <img
                    loading='lazy'
                    src='https://cdn.builder.io/api/v1/image/assets/TEMP/745d3e75b3701ea3b38d0d51196b4bd16c41952f19b7464b85215339e71a8481?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
                    alt='Our story illustration'
                    className='object-contain mt-28 w-full aspect-[1.22] max-md:mt-10 max-md:max-w-full'
                  />
                </div>
              </section>
            </div>
          </main>
          <main className='self-center mt-2.5 w-full max-w-[1323px] max-md:max-w-full'>
            <div className='flex flex-col gap-5 max-md:flex-col'>
              <section className='flex flex-col w-full max-md:ml-0 max-md:w-full'>
                <ProductCard product={products[0]} />
              </section>
              <section className='flex flex-col w-full max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col grow mt-20 font-medium max-md:mt-10 max-md:max-w-full'>
                  <div className='flex flex-col-reverse items-start pl-6 w-full max-md:pl-5 max-md:max-w-full'>
                    <ProductCard product={products[1]} />
                  </div>
                </div>
              </section>
            </div>
          </main>

          {/*Collecton Section */}
          <section className='px-20 py-16 mt-7 w-full bg-stone-900 max-md:px-5 max-md:max-w-full'>
            <div className='flex gap-5 max-md:flex-col'>
              <div className='flex flex-col w-[46%] max-md:ml-0 max-md:w-full'>
                <img
                  loading='lazy'
                  src='https://cdn.builder.io/api/v1/image/assets/TEMP/bd4465ec9b737fe46c9aa279635d470a94abb50da2d87a787ea57af8a955626d?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
                  alt="YINYANG's Best Collections"
                  className='object-contain grow w-full aspect-[1.08] max-md:mt-10 max-md:max-w-full'
                />
              </div>
              <div className='flex flex-col ml-5 w-[54%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col items-start mt-72 font-bold text-white max-md:mt-10 max-md:max-w-full'>
                  <h1 className='self-stretch text-5xl tracking-tighter leading-tight max-md:max-w-full max-md:text-4xl'>
                    YINYANG'S Best Collections
                  </h1>
                  <p className='mt-1 text-2xl tracking-tighter leading-10 max-md:max-w-full'>
                    Lorem ipsum dolor sit amet consectetur. Sed commodo
                    pellentesque arcu tristique et morbi.
                  </p>
                  <a href='#' className='mt-6 ml-8 text-base max-md:ml-2.5'>
                    Subscribe our collection
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* Newsletter Section */}
          <section className='flex justify-around items-center self-center mt-28 px-4 w-full max-w-[1323px] max-md:mt-10 max-md:max-w-full'>
            <div>
              <h2 className='text-2xl font-semibold tracking-wide leading-[60px] text-stone-900'>
                Get the Latest From YINYANG
              </h2>
              <p className='mt-2 text-gray-400'>
                Be the first to hear about new arrivals, promotions, style
                inspiration and exclusive sneak peeks.
              </p>
            </div>

            <form className='flex items-center mt-6 text-base max-md:max-w-full'>
              <div className='grow px-5 py-4 font-light tracking-wide leading-8 border border-black border-solid text-stone-900 w-fit max-md:px-5 max-md:max-w-full'>
                <label htmlFor='emailInput' className='sr-only'>
                  Enter email address
                </label>
                <input
                  type='email'
                  id='emailInput'
                  placeholder='Enter email address'
                  className='bg-transparent border-none w-full'
                  aria-label='Enter email address'
                />
              </div>
              <div className='flex flex-col font-medium text-white text-opacity-90'>
                <button
                  type='submit'
                  className='flex relative flex-col px-14 py-6 aspect-[2.766] max-md:px-5'
                >
                  <img
                    loading='lazy'
                    src='https://cdn.builder.io/api/v1/image/assets/TEMP/7ec7ea0b8001d84c32adf9e53506a1c095583f17d4d9871ead05e067ed9bbc32?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60'
                    className='object-cover absolute inset-0 size-full'
                    alt=''
                  />
                  <span className='relative z-10'>SIGN UP</span>
                </button>
              </div>
            </form>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
