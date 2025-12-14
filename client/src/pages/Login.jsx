import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Candy, Mail, Lock, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-rose-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-44 h-44 bg-amber-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-pink-200">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 p-4 rounded-full">
              <Candy className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8 flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Sign in to your sweet account</span>
          <Sparkles className="w-4 h-4 text-orange-500" />
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-pink-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-orange-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border-none rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105"
          >
            <span>Sign In</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-pink-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-600 font-medium">New to our shop?</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/register"
            className="inline-block px-8 py-2.5 rounded-xl font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 hover:border-pink-300 transition-all duration-200 transform hover:scale-105"
          >
            Create Account
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 right-5 opacity-20">
        <Candy className="w-24 h-24 text-pink-300 transform rotate-12" />
      </div>
      <div className="absolute top-5 right-1/4 opacity-20">
        <Candy className="w-16 h-16 text-orange-300 transform -rotate-12" />
      </div>
    </div>
  );
}