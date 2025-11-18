import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(form.email, form.password);
      if (result.user?.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied: Admin privileges required');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user?.isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-raisin-black flex items-center justify-center px-4">
      <div className="bg-secondary rounded-xl w-full max-w-md p-8">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-raisin-black text-white border border-border focus:border-coquelicot focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-coquelicot text-white font-semibold hover:bg-coquelicot/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
