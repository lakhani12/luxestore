import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, RotateCcw, ChevronRight, Minus, Plus } from 'lucide-react';
import { productService, wishlistService } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        // The backend returns { message: "...", product: { ... } }
        setProduct(response.data.product);
      } catch (err) {
        console.error("Failed to fetch product, using fallback", err);
        setProduct({
          _id: id,
          name: "Signature Gold Essential",
          price: 1299,
          description: "A timeless masterpiece of design and craftsmanship. Each piece is meticulously crafted from the finest materials.",
          category: "Exclusive",
          images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      alert('Product added to your boutique bag');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await wishlistService.addToWishlist(id);
      alert("Added to your curated wishlist.");
    } catch (err) {
      console.error(err);
      alert("Unable to add to wishlist. Please ensure you are logged in.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-2xl italic bg-luxury-gold-light">Loading Elegance...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-serif text-2xl italic bg-luxury-gold-light">Product Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-luxury-gold-light min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400 mb-12">
        <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-luxury-gold transition-colors">Collection</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-luxury-navy">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-white overflow-hidden shadow-2xl border border-luxury-gold/10">
            <img 
              src={product.images?.[activeImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square border-2 transition-all overflow-hidden ${activeImage === idx ? 'border-luxury-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-luxury-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">{product.category}</span>
          <h1 className="text-6xl font-serif text-luxury-navy mb-8 leading-tight italic">{product.name}</h1>
          
          <div className="flex items-center space-x-6 mb-10 border-b border-luxury-gold/10 pb-10">
            <div className="flex items-center text-luxury-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[10px] tracking-[0.2em] font-bold text-slate-400 uppercase">Authenticated Luxury</span>
          </div>

          <div className="text-4xl font-bold text-luxury-navy mb-12 tracking-tight">₹{product.price?.toLocaleString('en-IN')}</div>
          
          <div className="prose prose-slate mb-16">
            <p className="text-slate-600 leading-loose font-light text-lg italic">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col space-y-8 mb-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center border border-luxury-gold/30 bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-4 hover:bg-luxury-gold-light transition-colors"
                >
                  <Minus className="w-4 h-4 text-luxury-navy" />
                </button>
                <span className="w-16 text-center font-bold text-luxury-navy text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-4 hover:bg-luxury-gold-light transition-colors"
                >
                  <Plus className="w-4 h-4 text-luxury-navy" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow btn-premium py-6 flex items-center justify-center text-xs tracking-[0.3em]"
              >
                <ShoppingBag className="w-5 h-5 mr-3" /> Add To Boutique Bag
              </button>
              <button 
                onClick={handleAddToWishlist}
                className="p-6 border border-luxury-gold/10 bg-white hover:text-red-500 transition-all shadow-sm"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Luxury Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-y border-luxury-gold/10">
            <div className="flex items-center space-x-4 text-[10px] tracking-[0.2em] font-bold text-luxury-navy">
              <Truck className="w-5 h-5 text-luxury-gold" />
              <span>FREE DELIVERY</span>
            </div>
            <div className="flex items-center space-x-4 text-[10px] tracking-[0.2em] font-bold text-luxury-navy">
              <ShieldCheck className="w-5 h-5 text-luxury-gold" />
              <span>SECURE CHECKOUT</span>
            </div>
            <div className="flex items-center space-x-4 text-[10px] tracking-[0.2em] font-bold text-luxury-navy">
              <RotateCcw className="w-5 h-5 text-luxury-gold" />
              <span>EASY RETURNS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
