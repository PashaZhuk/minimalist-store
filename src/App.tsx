import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProductStore } from './store/useProductStore';
import { supabase } from './lib/supabase';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage'; // Импортируем новую страницу
import { Box, LayoutGrid, ShoppingBag } from 'lucide-react';
import "./App.css";

const categories = ['All', 'Audio', 'Peripherals', 'Home Office'];

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Новое состояние для навигации
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout'>('home');

  const { filterCategory, setFilter, cart } = useProductStore();
  const cartItemsCount = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', filterCategory],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      if (filterCategory !== 'All') {
        query = query.eq('category', filterCategory);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    // Отключаем запрос, если мы на странице чекаута, чтобы не тратить ресурсы
    enabled: currentPage === 'home',
  });

  // Функция для возврата на главную с фильтром
  const handleLogoClick = () => {
    setFilter('All');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 font-bold text-xl tracking-tighter cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-100">
              <Box className="text-white" size={20} />
            </div>
            <span>MINIMALIST.TECH</span>
          </div>
          
          {/* Скрываем категории, если мы на странице чекаута */}
          {currentPage === 'home' && (
            <div className="hidden md:flex items-center gap-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-sm font-medium transition-all relative py-1 ${
                    filterCategory === cat 
                      ? 'text-indigo-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-all relative active:scale-90"
            >
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white animate-in zoom-in">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {currentPage === 'home' ? (
          <>
            {/* Hero Section перенесен внутрь условия home */}
            <header className="pt-20 pb-16 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6 tracking-wide uppercase border border-indigo-100">
                <LayoutGrid size={14} />
                New Collection 2026
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                Work Smarter, <br />
                <span className="text-gray-400">Not Harder.</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                Premium tools for your digital workspace. Curated for performance and aesthetic perfection.
              </p>
            </header>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse rounded-[32px]" />
                ))}
              </div>
            ) : isError ? (
               <div className="text-center py-20 bg-red-50 rounded-[32px] border border-red-100">
                 <p className="text-red-500 font-bold">Error loading products. Check your Supabase connection.</p>
               </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {products.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-200 rounded-[32px]">
                    <Box size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium">No gadgets found in this category.</p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          /* Страница оформления заказа */
          <CheckoutPage onBack={() => setCurrentPage('home')} />
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-100 bg-white py-12 text-center text-sm text-gray-400">
        <p>© 2026 Minimalist Tech Portfolio. Built with React, Supabase & React Query.</p>
      </footer>

      {/* --- Overlay Components --- */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentPage('checkout');
        }}
      />
    </div>
  );
}

export default App;