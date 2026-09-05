import { Bell, Menu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header({ title, breadcrumbs = [], onMenuToggle }) {
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500">
        <Menu size={20} />
      </button>

      {/* Title / breadcrumbs */}
      <div className="flex-1 min-w-0">
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 text-xs text-slate-500 mb-0.5">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} />}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-blue-600 transition-colors">{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-white">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}
