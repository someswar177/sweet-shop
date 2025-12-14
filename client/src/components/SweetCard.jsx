import React from 'react';
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react';

export default function SweetCard({ sweet, onPurchase, isPurchasing, isAdmin, onEdit, onDelete }) {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group">
      
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm backdrop-blur-sm">
          <button 
            onClick={() => onEdit(sweet)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit Sweet"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(sweet._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Sweet"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="h-48 bg-indigo-50 flex items-center justify-center text-4xl">
        🍬
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{sweet.name}</h3>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              {sweet.category}
            </span>
          </div>
          <p className="font-bold text-indigo-600">₹{sweet.price}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className={`text-sm ${isOutOfStock ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
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