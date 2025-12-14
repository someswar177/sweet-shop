import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import SweetCard from '../components/SweetCard';
import SweetForm from '../components/SweetForm';
import SweetSkeleton from '../components/SweetSkeleton';
import DeleteModal from '../components/DeleteModal';
import toast from 'react-hot-toast';
import { LogOut, Package, Search, Plus, Filter, SlidersHorizontal } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Admin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Modal States
  const [deleteData, setDeleteData] = useState({ isOpen: false, id: null, name: '' });

  useEffect(() => {
    const timer = setTimeout(() => { fetchSweets(); }, 500);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, availableOnly]);

  const fetchSweets = async () => {
    try {
      const res = await api.get(`/sweets?search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&available=${availableOnly}`);
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

  // --- ADMIN ACTIONS ---
  const handleAddClick = () => {
    setEditingSweet(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (sweet) => {
    setEditingSweet(sweet);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (sweet) => {
    setDeleteData({ isOpen: true, id: sweet._id, name: sweet.name });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/sweets/${deleteData.id}`);
      toast.success('Sweet deleted');
      setSweets(prev => prev.filter(s => s._id !== deleteData.id));
      setDeleteData({ isOpen: false, id: null, name: '' }); // Close Modal
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
        toast.success('Updated successfully');
      } else {
        const res = await api.post('/sweets', formData);
        setSweets(prev => [...prev, res.data]);
        toast.success('Sweet added');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. MAIN NAVBAR (Brand & Search) */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Package size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">SweetShop</h1>
            </div>

            {/* Search Bar (Centered & Wide) */}
            <div className="hidden sm:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for sweets, categories..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900">{user?.email}</span>
                <span className="text-xs text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded-full uppercase tracking-wide">
                  {user?.role}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search (Visible only on small screens) */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
                <SlidersHorizontal size={16} />
                <span>Filters:</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <span className="text-xs text-gray-500">Price</span>
                <input 
                  type="number" placeholder="Min" 
                  className="w-12 bg-transparent text-sm focus:outline-none text-center"
                  value={minPrice} onChange={e => setMinPrice(e.target.value)}
                />
                <span className="text-gray-300">|</span>
                <input 
                  type="number" placeholder="Max" 
                  className="w-12 bg-transparent text-sm focus:outline-none text-center"
                  value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
                  availableOnly 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-green-500' : 'bg-gray-300'}`} />
                In Stock Only
              </button>
            </div>

            {/* Right: Admin Actions */}
            {isAdmin && (
              <button 
                onClick={handleAddClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all active:scale-95 text-sm font-medium"
              >
                <Plus size={18} />
                Add New Sweet
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SweetSkeleton key={i} />)}
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-gray-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">No sweets found</h2>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
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
                onDelete={() => handleDeleteClick(sweet)}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <SweetForm 
          initialData={editingSweet}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <DeleteModal 
        isOpen={deleteData.isOpen}
        sweetName={deleteData.name}
        onClose={() => setDeleteData({ isOpen: false, id: null, name: '' })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}