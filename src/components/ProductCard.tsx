import { useState } from 'react'; // Добавили для отслеживания ошибок загрузки
import { ShoppingCart, ImageOff } from 'lucide-react'; // Добавили иконку-заглушку
import type { Product } from '../types/database.types';
import { useProductStore } from '../store/useProductStore';

export const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useProductStore((state) => state.addToCart);
  
  // Состояние для обработки битой ссылки на картинку
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            // Если ссылка битая, срабатывает этот обработчик
            onError={() => setImgError(true)}
          />
        ) : (
          /* Красивая заглушка, если картинка не загрузилась */
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ImageOff size={40} strokeWidth={1.5} />
            <span className="text-[10px] uppercase font-bold tracking-tighter">Image not found</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-gray-900 leading-tight text-lg min-h-[3.5rem] line-clamp-2">
            {product.title}
          </h3>
          <p className="font-black text-indigo-600 whitespace-nowrap">${product.price}</p>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-6 leading-relaxed flex-1">
          {product.description}
        </p>

        <button 
          className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200 hover:shadow-indigo-200 mt-auto"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};