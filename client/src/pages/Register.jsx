import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Candy, Mail, Lock, Sparkles, UserPlus, Shield } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, isAdmin ? 'admin' : 'user');
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-36 h-36 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-10 w-44 h-44 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-amber-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-rose-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-orange-200">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-orange-400 via-amber-400 to-pink-400 p-4 rounded-full">
              <UserPlus className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text text-transparent">
          Join Our Sweet Shop
        </h2>
        <p className="text-center text-gray-600 mb-6 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Create your delicious account</span>
          <Sparkles className="w-4 h-4 text-pink-500" />
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-orange-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-pink-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-xl border-2 border-orange-200">
            <div className="flex items-start">
              <div className="flex items-center h-6">
                <input
                  id="admin-checkbox"
                  type="checkbox"
                  className="h-5 w-5 text-orange-500 focus:ring-orange-400 border-orange-300 rounded cursor-pointer"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </div>
              <div className="ml-3">
                <label htmlFor="admin-checkbox" className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  Register as Store Manager
                </label>
                <p className="text-xs text-gray-600 mt-1">Get admin access to manage the shop</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border-none rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 hover:from-orange-600 hover:via-amber-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105"
          >
            <span>Create Account</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-orange-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-600 font-medium">Already have an account?</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-block px-8 py-2.5 rounded-xl font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 transform hover:scale-105"
          >
            Sign In Instead
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 opacity-20">
        <Candy className="w-20 h-20 text-orange-300 transform -rotate-12" />
      </div>
      <div className="absolute top-10 left-1/4 opacity-20">
        <Candy className="w-16 h-16 text-pink-300 transform rotate-45" />
      </div>
      <div className="absolute top-1/2 right-10 opacity-15">
        <Candy className="w-28 h-28 text-amber-300 transform rotate-12" />
      </div>
    </div>
  );
}