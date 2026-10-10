import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from './Icons';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
              I
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              IssueFlow
            </span>
          </div>
          <div className="flex gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/issues" className={linkClass}>
              Issues
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
              {getInitials(user?.name)}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              {user?.name}
            </span>
          </div>
          <button onClick={logout} className="btn-secondary px-3 py-1.5">
            <LogoutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
}