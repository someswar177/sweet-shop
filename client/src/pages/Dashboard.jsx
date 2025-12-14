import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import SweetCard from '../components/SweetCard';
import toast from 'react-hot-toast';
import { LogOut, Package, Search } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSweets();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchSweets = async () => {
    try {
      const res = await api.get(`/sweets?search=${search}`);
      setSweets(res.data);
    } catch (error) {
      console.error('Fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    setPurchasingId(id);
    try {
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
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-2 text-indigo-600 self-start sm:self-auto">
            <Package size={24} />
            <h1 className="text-xl font-bold text-gray-800">Sweet Shop</h1>
          </div>

          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sweets (e.g., 'Milk', 'Ladoo')..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button onClick={logout} className="...">Logout</button>
          </div>
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