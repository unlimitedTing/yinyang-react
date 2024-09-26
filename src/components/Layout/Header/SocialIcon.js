import React from 'react';

function SocialIcon({ src, alt, url }) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='shrink-0'
    >
      <img
        loading='lazy'
        src={src}
        alt={alt}
        className='object-contain w-6 aspect-square'
      />
    </a>
  );
}

export default SocialIcon;
