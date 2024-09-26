// Footer.js

import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { user } = useSelector(state => state.user);
  const socialIcons = [
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d630063bc2aa12556c12e18fee99c78b8ee1f103ac04f8d10fa55f88d11384ae?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
      alt: 'Social icon 1'
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d1fefd54a4ce3525924c687301c1ef3a808ddf551f387432d2cf5c7ada01ac0d?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
      alt: 'Social icon 2'
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/10daf5006ef4f5d7c376ace39e9d79f7fffecc84b8d980a898e1f8cb4705ac20?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
      alt: 'Social icon 3'
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/a22a68529482e696cd3f73ced2cc011874d441b25f263519d6201e7268e4169c?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
      alt: 'Social icon 4'
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d0779a9f7245485f35aa28a6f315ff5c7924b6449fdfe4e005f8d4cac30a88b1?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
      alt: 'Social icon 5'
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1c4709177ab220b493558d0b9d21e24cae3cbbb1d9e6efc39c8719d6a26f5326?placeholderIfAbsent=true&apiKey=a7f37bd336bb4767a5dc599b61a73e60',
      alt: 'Social icon 6'
    }
  ];
  const linkCategories = [
    {
      title: 'Marketplace',
      links: ['Buy Product', 'Sell Product', 'Our Creator']
    },
    {
      title: 'Resources',
      links: ['About Us', 'Event', 'Tutorial']
    },
    {
      title: 'Company',
      links: ['Media', 'Blog', 'Pricing']
    },
    {
      title: 'Legal',
      links: ['Terms', 'Privacy', 'Support']
    }
  ];
  return (
    <footer className='flex overflow-hidden flex-col items-center px-20 pt-20 pb-10 mt-28 w-full bg-black text-white border border-solid border-black border-opacity-20 max-md:px-5 max-md:mt-10 max-md:max-w-full'>
      <div className='flex flex-col w-full max-w-[1192px] max-md:max-w-full'>
        <div className='w-full max-w-[1135px] max-md:max-w-full'>
          <div className='flex gap-5 max-md:flex-col'>
            <div className='flex flex-col w-[28%] max-md:ml-0 max-md:w-full'>
              <div className='flex flex-col w-full max-md:mt-10'>
                <h2 className='text-5xl font-bold text-whitemax-md:text-4xl'>
                  YINYANG
                </h2>
                <p className='mt-4 text-base leading-4 text-white text-opacity-80'>
                  This growth plan will help you reach your resolutions and
                  achieve the goals you have been striving towards.
                </p>
                <div className='flex gap-6 items-center self-start mt-4'>
                  {socialIcons.map((icon, index) => (
                    <img
                      key={index}
                      loading='lazy'
                      src={icon.src}
                      alt={icon.alt}
                      className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col ml-5 w-[72%] max-md:ml-0 max-md:w-full'>
              <div className='flex flex-col w-full max-md:mt-10 max-md:max-w-full'>
                <nav className='flex text-xl flex-wrap gap-5 justify-between mt-5 text-base leading-none text-white text-opacity-80 font-bold max-md:mr-2.5 max-md:max-w-full'>
                  {linkCategories.map((category, index) => (
                    <div key={index} className='self-stretch my-auto'>
                      {category.title}
                    </div>
                  ))}
                </nav>
                <div className='flex flex-wrap gap-5 justify-between mt-5 text-base leading-none text-white text-opacity-80 max-md:max-w-full'>
                  {linkCategories.map((category, index) => (
                    <div key={index} className='flex flex-col'>
                      {category.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href='#'
                          className={linkIndex > 0 ? 'mt-2.5' : ''}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='gap-8 self-stretch pt-8 mt-9 text-base border-t border-gray-200 border-opacity-20 text-white text-opacity-80 w-[300px] flex justify-center'>
          © {new Date().getFullYear()} YINYANG. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
