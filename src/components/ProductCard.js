import React from 'react';
import './ProductCard.css';  // CSS for product cards

const ProductCard = ({ image, name, price, size }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{price} $</p>
      <div className="product-sizes">
        <span>{size}</span>
      </div>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
