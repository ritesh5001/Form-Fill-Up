import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { http } from '../api/http';
import { setAuth } from '../features/authSlice';

export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await http.post(endpoint, payload);
      dispatch(setAuth(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-teal-950 to-slate-900 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/90 p-6">
        <h1 className="text-2xl font-bold text-cyan-300">{isLogin ? 'Login' : 'Register'}</h1>
        <p className="mt-1 text-sm text-slate-400">MailFusion access panel</p>

        {!isLogin && (
          <input
            className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        )}

        <input
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />

        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        <button
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900 disabled:opacity-70"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
        </button>

        <p className="mt-4 text-sm text-slate-400">
          {isLogin ? 'No account?' : 'Already registered?'}{' '}
          <Link className="text-cyan-300" to={isLogin ? '/register' : '/login'}>
            {isLogin ? 'Register' : 'Login'}
          </Link>
        </p>
      </form>
    </div>
  );
}
