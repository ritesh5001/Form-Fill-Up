import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../features/authSlice';
import { http } from '../api/http';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/send-mail', label: 'Send Mail' },
  { to: '/bulk-mail', label: 'Bulk Mail' },
  { to: '/templates', label: 'Templates' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const onLogout = async () => {
    try {
      await http.post('/auth/logout');
    } catch (_error) {
      // local logout should still happen
    }

    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-cyan-300">MailFusion</h1>
            <p className="text-xs text-slate-400">Production mail control panel</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">{user?.name}</span>
            <button onClick={onLogout} className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-medium text-white">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${
                    isActive ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
