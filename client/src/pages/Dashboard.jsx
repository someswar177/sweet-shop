import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import SweetCard from '../components/SweetCard';
import SweetForm from '../components/SweetForm';
import SweetSkeleton from '../components/SweetSkeleton';
import DeleteModal from '../components/DeleteModal';
import toast from 'react-hot-toast';
import { LogOut, Candy, Search, Plus, SlidersHorizontal, ChefHat, X } from 'lucide-react';

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

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toast.success(`Delicious choice! ${res.data.data.name} added.`);
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
      toast.success('Removed from display case');
      setSweets(prev => prev.filter(s => s._id !== deleteData.id));
      setDeleteData({ isOpen: false, id: null, name: '' }); 
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSweet) {
        const res = await api.put(`/sweets/${editingSweet._id}`, formData);
        setSweets(prev => prev.map(s => s._id === editingSweet._id ? res.data : s));
        toast.success('Sweet recipe updated');
      } else {
        const res = await api.post('/sweets', formData);
        setSweets(prev => [...prev, res.data]);
        toast.success('Fresh sweet added to shelf');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* 1. MAIN NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm/50 backdrop-blur-lg bg-white/90 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* BRAND LOGO */}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="bg-gradient-to-br from-orange-400 to-rose-500 text-white p-2 rounded-xl shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform duration-300">
                <Candy size={22} className="drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent tracking-tight leading-none">
                  SweetShop
                </h1>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Premium Desserts</span>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden sm:block flex-1 max-w-lg mx-8 transition-all duration-300 focus-within:max-w-xl">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search for gulab jamun, ladoo..."
                  // Added pr-10 to prevent text from going behind the X button
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-inner focus:shadow-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                
                {/* CLEAR BUTTON (X) */}
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-700">{user?.email}</span>
                <span className="text-[10px] text-rose-600 font-bold px-2 py-0.5 bg-rose-50 rounded-full uppercase tracking-wider border border-rose-100">
                  {user?.role === 'admin' ? 'Store Manager' : 'Customer'}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-4 pt-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sweets..."
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-rose-500/50 focus:bg-white focus:border-rose-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* MOBILE CLEAR BUTTON (X) */}
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. FILTERS & ACTIONS (Sticky) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-[64px] sm:top-[64px] z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Filters Group */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2 whitespace-nowrap">
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Find your craving:</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all shadow-sm">
                <span className="text-xs text-gray-400 font-bold">₹</span>
                <input 
                  type="number" placeholder="Min" 
                  className="w-10 bg-transparent text-sm focus:outline-none text-center placeholder:text-gray-300"
                  value={minPrice} onChange={e => setMinPrice(e.target.value)}
                />
                <span className="text-gray-300">|</span>
                <input 
                  type="number" placeholder="Max" 
                  className="w-10 bg-transparent text-sm focus:outline-none text-center placeholder:text-gray-300"
                  value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all whitespace-nowrap shadow-sm ${
                  availableOnly 
                    ? 'bg-green-50 text-green-700 border-green-200 shadow-green-100' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${availableOnly ? 'bg-green-500' : 'bg-gray-300'}`} />
                Fresh Stock Only
              </button>
            </div>

            {/* Admin Action - Thematic Button */}
            {isAdmin && (
              <button 
                onClick={handleAddClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-600 text-white px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all text-sm font-bold tracking-wide"
              >
                <ChefHat size={18} strokeWidth={2.5} />
                Stock New Treat
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. SWEET GRID */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SweetSkeleton key={i} />)}
          </div>
        ) : sweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Search className="text-rose-300" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">No sweets found</h2>
            <p className="text-gray-500 mt-2">Our shelves are empty for this search.</p>
            <button 
              onClick={() => {setSearch(''); setMinPrice(''); setMaxPrice(''); setAvailableOnly(false);}}
              className="mt-6 text-rose-600 font-semibold hover:text-rose-700 hover:underline transition-all"
            >
              Clear all filters
            </button>
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

      {/* Modals */}
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