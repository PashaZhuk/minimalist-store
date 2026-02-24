import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

// Добавляем onCheckout в типы пропсов
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer = ({ isOpen, onClose, onCheckout }: CartDrawerProps) => {
  // Достаем методы из стора
  const { cart, removeFromCart, addToCart, decreaseQuantity } = useProductStore();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Backdrop с плавным появлением */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <ShoppingBag className="text-indigo-600" size={24} />
            <span>Your Cart</span>
            {cart.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-200" />
              </div>
              <p className="text-gray-900 font-bold">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some tech to your workspace</p>
              <button 
                onClick={onClose}
                className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
              >
                Back to Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-start group">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{item.title}</h4>
                  <p className="text-indigo-600 font-black text-sm mt-0.5">${item.price}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-gray-900 font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-900 font-bold">Total Amount</span>
                <span className="text-2xl font-black text-indigo-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            {/* Меняем alert на функцию onCheckout */}
            <button 
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-xl shadow-gray-200"
              onClick={onCheckout}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};