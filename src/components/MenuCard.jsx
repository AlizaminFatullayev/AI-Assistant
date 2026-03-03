export default function MenuCard({ item }) {
  return (
    <div className="group flex flex-col gap-3 bg-white/5 dark:bg-white/5 p-3 rounded-xl border border-primary/5 hover:border-primary/20 transition-colors">
      {/* Image */}
      <div
        className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-lg overflow-hidden relative"
        style={{ backgroundImage: `url("${item.image}")` }}
      >
        <div className="absolute top-2 right-2 bg-[#221910]/80 backdrop-blur-md px-2 py-1 rounded text-primary text-sm font-bold">
          {item.price.toFixed(2)} AZN
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">{item.name}</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-snug mt-1">{item.description}</p>
        {/* Allergen chips */}
        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.allergens.map((a) => (
              <span
                key={a}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium uppercase tracking-wide"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
