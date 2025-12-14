import React, { useState } from 'react';
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react';

export default function SweetCard({ sweet, onPurchase, isPurchasing, isAdmin, onEdit, onDelete }) {
  const isOutOfStock = sweet.quantity === 0;
  
  const [imageError, setImageError] = useState(false);

  const imageSource = sweet.image ? sweet.image : '/images/sweets.jpg';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group h-full flex flex-col">
      
      {/* Admin Buttons */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm backdrop-blur-sm z-10">
          <button 
            onClick={() => onEdit(sweet)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit Sweet"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(sweet)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Sweet"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="h-48 overflow-hidden relative bg-gray-100 flex items-center justify-center">
        {!imageError ? (
          <img 
            src={imageSource}
            alt={sweet.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
            onError={() => setImageError(true)} // If image fails, switch to Emoji
          />
        ) : (
          // EMOJI FALLBACK (Level 3)
          <span className="text-6xl select-none animate-bounce-slow">🍬</span>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold text-gray-700 shadow-sm z-10">
          {sweet.category}
        </div>
      </div>
      
      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{sweet.name}</h3>
            <p className="font-bold text-indigo-600">₹{sweet.price}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <p className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} left`}
          </p>

          <button
            onClick={() => onPurchase(sweet._id)}
            disabled={isOutOfStock || isPurchasing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
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