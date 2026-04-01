
import React, { useState, useEffect } from 'react';
import Product from './Product';
import { useCart } from '../../context/cartContext';


function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products data from backend API
    const getProducts = async () => {
        try {
            const response = await fetch('/store/products');
            const data = await response.json()
            console.log('data: ', data);
            if (data.error) {
                throw new Error(data.error);
            }
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products: ', error);
        }
    };

    getProducts();

   
  }, []);

  const [cart, setCart] = useCart();

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      const updatedCart = cart.map(item => {
        if (item._id === product._id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));


    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      localStorage.setItem('cart', JSON.stringify([...cart, { ...product, quantity: 1 }]));
    }

  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category || 'Miscellaneous'))];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory || (!product.category && selectedCategory === 'Miscellaneous');
    return matchesSearch && matchesCategory;
  });

  



  return (
    
    <div className="w-full px-8 py-12 glass-morphism border-2 border-blood-red/20 shadow-2xl overflow-hidden relative">
        {/* Background Glow Element */}
        <div className='absolute -right-20 -top-20 w-80 h-80 bg-crimson-glow opacity-5 rounded-full blur-[120px] pointer-events-none'></div>

        <div className='flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-blood-red/30 pb-8 gap-6'>
            <div className='text-left w-full md:w-auto'>
                <h1 className="text-4xl font-orbitron font-bold text-white crimson-glow-text uppercase tracking-widest">
                    EQUIPMENT DEPOT
                </h1>
                <p className='text-[10px] font-inter text-gray-500 mt-2 tracking-[0.2em] uppercase mb-4'>High-Fidelity Anime Collectibles</p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-1.5 font-orbitron text-[10px] tracking-widest transition-all ${
                        selectedCategory === category 
                        ? 'bg-blood-red text-white border-blood-red' 
                        : 'bg-transparent text-gray-400 border border-blood-red/40 hover:border-blood-red hover:text-blood-red'
                      }`}
                    >
                      {category.toUpperCase()}
                    </button>
                  ))}
                </div>
            </div>

            <div className='relative group w-full md:w-1/3'>
                <input
                className='w-full bg-deep-black/60 border-2 border-blood-red/40 px-6 py-3 font-orbitron text-xs text-white focus:outline-none focus:border-crimson-glow transition-all placeholder:text-gray-600'
                type="text"
                placeholder="SEARCH INVENTORY..."
                value={searchTerm}
                onChange={handleSearch}
                />
                <div className='absolute bottom-0 left-0 w-0 h-[2px] bg-crimson-glow transition-all duration-300 group-hover:w-full'></div>
            </div>
        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
                <Product key={product._id} product={product} onAddToCart={handleAddToCart}/>
            ))}
        </div>
    </div>
    
  );
}

export default AllProducts;
