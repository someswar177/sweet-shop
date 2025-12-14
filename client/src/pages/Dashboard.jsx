import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import SweetCard from '../components/SweetCard';
import toast from 'react-hot-toast';
import { LogOut, Package } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get('/sweets');
      setSweets(res.data);
    } catch (error) {
      toast.error('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    setPurchasingId(id);
    try {
      // 1. Call API
      const res = await api.post(`/sweets/${id}/purchase`);
      toast.success(`Enjoy your ${res.data.data.name}!`);
      
      setSweets(prev => prev.map(sweet => 
        sweet._id === id ? { ...sweet, quantity: sweet.quantity - 1 } : sweet
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not purchase');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600">
          <Package size={24} />
          <h1 className="text-xl font-bold text-gray-800">Sweet Shop</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Signed in as <span className="font-semibold text-gray-900">{user?.email}</span>
          </span>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center pt-20 text-gray-500">Loading your treats...</div>
        ) : sweets.length === 0 ? (
          <div className="text-center pt-20">
            <h2 className="text-xl font-semibold text-gray-700">Store is Empty</h2>
            <p className="text-gray-500">Check back later for new stock.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map(sweet => (
              <SweetCard 
                key={sweet._id} 
                sweet={sweet} 
                onPurchase={handlePurchase}
                isPurchasing={purchasingId === sweet._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}