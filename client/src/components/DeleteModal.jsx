import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, sweetName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-red-100">
        <div className="p-6 text-center">
          <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">Remove from Shelf?</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Are you sure you want to stop selling <span className="font-bold text-gray-800">"{sweetName}"</span>? This will remove it from the display case immediately.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
            >
              Keep it
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 font-bold shadow-md transition-all active:scale-95"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}