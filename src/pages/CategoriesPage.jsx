import { useNavigate } from 'react-router-dom';
import { categories, menuItems } from '../data/menuItems';
import BottomNav from '../components/BottomNav';

const categoryIcons = {
  all: 'restaurant_menu',
  italian: 'local_pizza',
  burgers: 'lunch_dining',
  steaks: 'outdoor_grill',
  desserts: 'cake',
};

export default function CategoriesPage() {
  const navigate = useNavigate();

  const getCount = (catId) =>
    catId === 'all'
      ? menuItems.length
      : menuItems.filter((i) => i.category === catId).length;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <div className="w-12" />
          <h1 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight flex-1 text-center font-display">
            Kateqoriyalar
          </h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('/', { state: { category: cat.id } })}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-primary/10 bg-white/5 dark:bg-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {categoryIcons[cat.id] || 'restaurant'}
                </span>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900 dark:text-slate-100">{cat.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {getCount(cat.id)} məhsul
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
