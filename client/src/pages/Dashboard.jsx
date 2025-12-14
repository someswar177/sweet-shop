import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import SweetCard from '../components/SweetCard';
import SweetForm from '../components/SweetForm';
import SweetSkeleton from '../components/SweetSkeleton';
import toast from 'react-hot-toast';
import { LogOut, Package, Search, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [purchasingId, setPurchasingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { fetchSweets(); }, 500);
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
      setSweets(prev => prev.map(s => s._id === id ? { ...s, quantity: s.quantity - 1 } : s));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not purchase');
    } finally {
      setPurchasingId(null);
    }
  };

  const handleAddClick = () => {
    setEditingSweet(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (sweet) => {
    setEditingSweet(sweet);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    try {
      await api.delete(`/sweets/${id}`);
      toast.success('Sweet deleted');
      setSweets(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSweet) {
        const res = await api.put(`/sweets/${editingSweet._id}`, formData);
        setSweets(prev => prev.map(s => s._id === editingSweet._id ? res.data : s));
        toast.success('Sweet updated successfully');
      } else {
        const res = await api.post('/sweets', formData);
        setSweets(prev => [...prev, res.data]);
        toast.success('Sweet added to inventory');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-600 self-start sm:self-auto">
            <Package size={24} />
            <h1 className="text-xl font-bold text-gray-800">Sweet Shop</h1>
            {isAdmin && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-bold">ADMIN</span>}
          </div>

          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sweets..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 self-end sm:self-auto">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
               <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
             </div>
             <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
          
          {isAdmin && (
            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
            >
              <Plus size={20} />
              Add Sweet
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SweetSkeleton key={i} />
            ))}
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center pt-20 text-gray-500">No sweets found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map(sweet => (
              <SweetCard 
                key={sweet._id} 
                sweet={sweet} 
                onPurchase={handlePurchase}
                isPurchasing={purchasingId === sweet._id}
                isAdmin={isAdmin}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Admin Modal */}
      {isModalOpen && (
        <SweetForm 
          initialData={editingSweet}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}