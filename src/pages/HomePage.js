import React from 'react';
import Header from '../components/Header';
import OfferBanner from '../components/OfferBanner';
import ProductCard from '../components/Productcard';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div>
      <Header />
      <OfferBanner />
      
      <section className="products-section">
        <h2>Jewelry tells eternal stories</h2>
        <div className="product-grid">
          <ProductCard
            image="path-to-gemstone-ring-image"
            name="Gemstone Bracelet"
            price="680.90"
            size="S M L"
          />
          <ProductCard
            image="path-to-silver-ring-image"
            name="Silver Ring"
            price="280.90"
            size="S M L"
          />
        </div>
      </section>

      <section className="collections-section">
        <h2>YINYANG's Best Collections</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
