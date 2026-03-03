import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-[#2a1e13] border-t border-primary/20">
      <div className="flex max-w-2xl mx-auto px-4 py-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>
                home
              </span>
              <p className={`text-[10px] leading-none uppercase tracking-widest ${isActive ? 'font-bold' : 'font-medium'}`}>
                Ana Səhifə
              </p>
            </>
          )}
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>
                grid_view
              </span>
              <p className={`text-[10px] leading-none uppercase tracking-widest ${isActive ? 'font-bold' : 'font-medium'}`}>
                Kateqoriya
              </p>
            </>
          )}
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined ${isActive ? 'active-icon' : ''}`}>
                smart_toy
              </span>
              <p className={`text-[10px] leading-none uppercase tracking-widest ${isActive ? 'font-bold' : 'font-medium'}`}>
                AI Söhbət
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
