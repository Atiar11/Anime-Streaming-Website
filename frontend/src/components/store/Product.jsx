// Product.js

import React from "react";
import { useAuthContext } from "../../context/AuthContext";

const Product = ({ product, onAddToCart }) => {
  const { authUser } = useAuthContext();

  const handleClick = () => {
    onAddToCart(product);
  };

  // handle add to wishlist func
  const handleWishlist = (product) => {
    const productData = {
      userId: authUser?._id,
      productId: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageURL: product.imageURL,
    };

    fetch("/store/wishlist", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="group relative bg-deep-black border border-blood-red/20 overflow-hidden hover:border-crimson-glow/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-crimson-outer flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.imageURL}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-4 right-4 bg-deep-black/80 border border-crimson-glow/40 px-3 py-1 font-orbitron text-[10px] text-crimson-glow">
          ${product.price}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h2 className="font-orbitron font-bold text-white text-lg tracking-wider mb-1 group-hover:text-crimson-glow transition-colors uppercase">
          {product.name}
        </h2>
        <span className="text-[10px] font-orbitron text-blood-red mb-3 tracking-widest uppercase block">
          {product.category || 'Miscellaneous'}
        </span>
        <p className="font-inter text-xs text-gray-500 mb-6 flex-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => handleWishlist(product)}
            className="flex-1 py-3 border border-blood-red/40 text-blood-red font-orbitron text-[10px] tracking-widest hover:bg-blood-red/10 hover:border-blood-red transition-all flex items-center justify-center gap-2"
          >
            WISHLIST
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <button 
            onClick={handleClick} 
            className="flex-1 py-3 bg-blood-red text-white font-orbitron text-[10px] tracking-widest hover:bg-crimson-glow transition-colors shadow-lg"
          >
            ADD TO CART
          </button>
        </div>
      </div>
      
      {/* Tactical Glow Corner */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-blood-red/0 group-hover:border-crimson-glow/100 transition-all"></div>
    </div>
  );
};

export default Product;
