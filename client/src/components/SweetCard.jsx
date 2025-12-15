import React, { useState } from 'react';
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react';

export default function SweetCard({ sweet, onPurchase, isPurchasing, isAdmin, onEdit, onDelete }) {
  const isOutOfStock = sweet.quantity === 0;
  
  const [imageError, setImageError] = useState(false);
  const imageSource = sweet.image ? sweet.image : '/images/sweets.jpg';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group h-full flex flex-col">
      
      {/* Admin Buttons */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-lg shadow-sm backdrop-blur-sm z-10">
          <button 
            onClick={() => onEdit(sweet)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit Sweet"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(sweet)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Sweet"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="h-48 overflow-hidden relative bg-gray-50 flex items-center justify-center group">
        {!imageError ? (
          <img 
            src={imageSource}
            alt={sweet.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
            onError={() => setImageError(true)} 
          />
        ) : (
          <span className="text-6xl select-none animate-bounce-slow">🍬</span>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-md text-xs font-bold text-gray-700 shadow-sm z-10 uppercase tracking-wider">
          {sweet.category}
        </div>
      </div>
      
      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{sweet.name}</h3>
            <p className="font-bold text-rose-600 text-lg">₹{sweet.price}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <p className={`text-sm font-semibold ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} left`}
          </p>

          <button
            onClick={() => onPurchase(sweet._id)}
            disabled={isOutOfStock || isPurchasing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all duration-200
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-orange-500 to-rose-600 text-white hover:from-orange-600 hover:to-rose-700 hover:shadow-lg active:scale-95'
              }`}
          >
            <ShoppingCart size={16} />
            {isPurchasing ? 'Buying...' : (isOutOfStock ? 'Sold Out' : 'Buy')}
          </button>
        </div>
      </div>
    </div>
  );
}