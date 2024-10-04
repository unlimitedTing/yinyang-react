import React from 'react';

function NavigationItem({ label, width, href }) {
  return (
    <div className='flex flex-col' style={{ width }}>
      <a href={href}>{label}</a>
      <div className='flex mt-4 w-full bg-amber-400 min-h-[2px]' />
    </div>
  );
}

export default NavigationItem;
