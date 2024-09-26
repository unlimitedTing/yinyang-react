import React from 'react';

function NavigationItem({ label, width }) {
  return (
    <div className='flex flex-col' style={{ width }}>
      <div>{label}</div>
      <div className='flex mt-4 w-full bg-amber-400 min-h-[2px]' />
    </div>
  );
}

export default NavigationItem;
