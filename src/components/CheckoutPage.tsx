import { useState, useEffect, type FormEvent } from 'react'; // Добавили type FormEvent
import { ArrowLeft, CheckCircle2, Package, ArrowRight, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

export const CheckoutPage = ({ onBack }: { onBack: () => void }) => {
  const { cart, clearCart } = useProductStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      onBack();
    }
  }, [cart, isSuccess, onBack]);

  // Используем FormEvent<HTMLFormElement> без приставки React.
  // Это уберет зачеркивание, так как мы берем тип напрямую из импорта выше.
  const handlePay = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-200">
          <CheckCircle2 size={40} className="text-white" />
        </div>

        <h2 className="text-4xl font-black mb-4 tracking-tighter text-gray-900">Order Confirmed.</h2>
        <p className="text-gray-500 max-w-sm mb-12 leading-relaxed">
          Your payment was successful. We've started preparing your minimalist gear for shipment.
        </p>

        <div className="w-full max-w-md space-y-3">
          <div className="p-6 bg-white border border-gray-100 rounded-[24px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                <Package size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order ID</p>
                <p className="font-bold text-gray-900">#MT-99210</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</p>
              <p className="font-bold text-indigo-600">Processing</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="mt-12 flex items-center gap-3 text-gray-900 font-bold hover:gap-5 transition-all duration-300 group"
        >
          Back to Store
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Continue Shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-10">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 text-gray-900">Checkout.</h2>
            <p className="text-gray-500">Please enter your shipping and payment details.</p>
          </div>

          <form className="space-y-6" onSubmit={handlePay}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required type="text" placeholder="First Name" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300" />
              <input required type="text" placeholder="Last Name" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300" />
            </div>
            <input required type="email" placeholder="Email Address" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300" />
            <input required type="text" placeholder="Shipping Address" className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300" />
            
            <div className="pt-6">
              <label className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 block">Secure Payment</label>
              <div className="p-5 border-2 border-indigo-600 rounded-[24px] bg-indigo-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                    <CreditCard className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">Credit or Debit Card</p>
                    <p className="text-xs text-indigo-600/60 font-medium">Encrypted & Secure</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-indigo-600 border-[5px] border-white shadow-sm" />
              </div>
            </div>

            <button 
              disabled={isProcessing}
              className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-2xl shadow-gray-200 mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 sticky top-32 shadow-sm">
            <h3 className="font-black text-xl mb-8 tracking-tight">Your Order</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-6 mb-8 scrollbar-hide">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4 animate-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                         <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                   </div>
                   <p className="font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-50 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Subtotal</span>
                <span className="text-gray-900 font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Shipping</span>
                <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <span className="text-gray-900 font-black text-xl">Total</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-10 flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
               <ShieldCheck size={20} className="text-indigo-600 shrink-0" />
               <p className="text-[10px] leading-relaxed text-gray-400 font-medium uppercase tracking-tight">
                 Secure Checkout. Your data is encrypted with 256-bit SSL technology.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};