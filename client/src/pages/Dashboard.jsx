import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}