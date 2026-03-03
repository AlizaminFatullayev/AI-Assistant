import { useState } from 'react';
import { categories, menuItems } from '../data/menuItems';
import MenuCard from '../components/MenuCard';
import BottomNav from '../components/BottomNav';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <div className="text-primary flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </div>
          <div className="w-12" />
          <h1 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight flex-1 text-center font-display">
            Zest &amp; <span className="text-primary">Flame</span>
          </h1>
        </div>

        {/* Category Tab Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex overflow-x-auto no-scrollbar px-4 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 shrink-0 transition-colors ${
                  activeCategory === cat.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'
                }`}
              >
                <p className={`text-sm tracking-wide ${activeCategory === cat.id ? 'font-bold' : 'font-medium'}`}>
                  {cat.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between pt-6 pb-4">
          <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight font-display">
            İmza Menyusu
          </h2>
          <span className="text-primary text-sm font-medium">{filtered.length} Məhsul</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
