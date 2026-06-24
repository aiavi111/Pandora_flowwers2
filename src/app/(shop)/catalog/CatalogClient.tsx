'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  Grid3X3,
  Grid2X2,
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { Product, Category } from '@/types';
import { cn, FLOWER_COLORS, OCCASIONS } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'popular', label: 'По популярности' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
];

const PRICE_RANGES = [
  { label: 'До 2 000 с', min: 0, max: 2000 },
  { label: '2 000–5 000 с', min: 2000, max: 5000 },
  { label: '5 000–10 000 с', min: 5000, max: 10000 },
  { label: '10 000–20 000 с', min: 10000, max: 20000 },
  { label: 'Свыше 20 000 с', min: 20000, max: 999999 },
];

interface CatalogClientProps {
  initialProducts: Product[];
  categories: (Category & { _count: { products: number } })[];
  totalCount: number;
  params: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    occasion?: string;
  };
}

export default function CatalogClient({
  initialProducts,
  categories,
  totalCount,
  params,
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      router.push(`/catalog?${current.toString()}`);
    },
    [router, searchParams]
  );

  const activeFiltersCount = [
    params.category,
    params.minPrice || params.maxPrice,
    params.colors,
    params.occasion,
  ].filter(Boolean).length;

  const clearFilters = () => {
    router.push('/catalog');
  };

  const currentCategory = categories.find((c) => c.slug === params.category);

  return (
    <div className="bg-pandora-cream min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-pandora-border">
        <div className="container-site py-8">
          <div className="text-pandora-muted text-xs uppercase tracking-widest mb-2">
            {params.search ? `Поиск: "${params.search}"` : 'Каталог'}
          </div>
          <h1 className="section-title">
            {currentCategory?.name ?? (params.search ? 'Результаты поиска' : 'Все букеты')}
          </h1>
          {currentCategory?.description && (
            <p className="text-pandora-muted mt-2 max-w-2xl">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="container-site py-8">
        <div className="flex gap-8">
          {/* ── SIDEBAR ── */}
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={cn(
              'fixed md:sticky top-0 md:top-24 left-0 h-screen md:h-auto w-72 bg-white md:bg-transparent z-50 md:z-auto overflow-y-auto md:overflow-visible transition-transform duration-300 shadow-xl md:shadow-none',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
              'md:w-64 lg:w-72 flex-shrink-0'
            )}
          >
            <div className="p-4 md:p-0 space-y-6">
              {/* Mobile close */}
              <div className="flex items-center justify-between md:hidden py-2">
                <h2 className="font-serif text-xl text-pandora-dark">Фильтры</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-pandora-muted hover:text-pandora-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <FilterSection title="Категория">
                <button
                  onClick={() => updateParams({ category: undefined })}
                  className={cn(
                    'w-full text-left py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-between',
                    !params.category
                      ? 'bg-pandora-rose text-white'
                      : 'text-pandora-text hover:bg-pandora-border'
                  )}
                >
                  <span>Все</span>
                  <span className="text-xs opacity-70">
                    {categories.reduce((s, c) => s + c._count.products, 0)}
                  </span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParams({ category: cat.slug })}
                    className={cn(
                      'w-full text-left py-2 px-3 rounded-sm text-sm transition-colors flex items-center justify-between',
                      params.category === cat.slug
                        ? 'bg-pandora-rose text-white'
                        : 'text-pandora-text hover:bg-pandora-border'
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-70">{cat._count.products}</span>
                  </button>
                ))}
              </FilterSection>

              {/* Price */}
              <FilterSection title="Цена">
                <button
                  onClick={() => updateParams({ minPrice: undefined, maxPrice: undefined })}
                  className={cn(
                    'w-full text-left py-2 px-3 rounded-sm text-sm transition-colors',
                    !params.minPrice && !params.maxPrice
                      ? 'bg-pandora-rose text-white'
                      : 'text-pandora-text hover:bg-pandora-border'
                  )}
                >
                  Любая цена
                </button>
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      updateParams({
                        minPrice: range.min.toString(),
                        maxPrice: range.max === 999999 ? undefined : range.max.toString(),
                      })
                    }
                    className={cn(
                      'w-full text-left py-2 px-3 rounded-sm text-sm transition-colors',
                      params.minPrice === range.min.toString()
                        ? 'bg-pandora-rose text-white'
                        : 'text-pandora-text hover:bg-pandora-border'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </FilterSection>

              {/* Color */}
              <FilterSection title="Цвет">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(FLOWER_COLORS).slice(0, 8).map(([key, label]) => {
                    const colorMap: Record<string, string> = {
                      red: '#e53e3e',
                      white: '#f7fafc',
                      pink: '#ed64a6',
                      yellow: '#ecc94b',
                      orange: '#ed8936',
                      purple: '#805ad5',
                      lilac: '#b794f4',
                      blue: '#4299e1',
                      peach: '#f6ad55',
                      cream: '#fefcbf',
                      green: '#48bb78',
                    };
                    const isActive = params.colors === key;
                    return (
                      <button
                        key={key}
                        onClick={() => updateParams({ colors: isActive ? undefined : key })}
                        title={label}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
                          isActive ? 'border-pandora-rose scale-110 shadow-md' : 'border-pandora-border'
                        )}
                        style={{ backgroundColor: colorMap[key] ?? '#ccc' }}
                      />
                    );
                  })}
                </div>
              </FilterSection>

              {/* Occasion */}
              <FilterSection title="Повод">
                {Object.entries(OCCASIONS).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 py-1 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={params.occasion === key}
                      onChange={() =>
                        updateParams({ occasion: params.occasion === key ? undefined : key })
                      }
                      className="w-4 h-4 accent-pandora-rose rounded"
                    />
                    <span className="text-sm text-pandora-text group-hover:text-pandora-rose transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </FilterSection>

              {/* Clear */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 border border-red-300 text-red-500 text-sm rounded-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Сбросить все фильтры ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>

          {/* ── PRODUCTS ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border border-pandora-border rounded-sm text-sm hover:border-pandora-rose transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-pandora-rose text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <span className="text-pandora-muted text-sm">
                  {totalCount} {totalCount === 1 ? 'букет' : totalCount < 5 ? 'букета' : 'букетов'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Grid toggle */}
                <div className="hidden md:flex items-center gap-1 border border-pandora-border rounded-sm p-1">
                  <button
                    onClick={() => setGridCols(3)}
                    className={cn(
                      'p-1.5 rounded-sm transition-colors',
                      gridCols === 3 ? 'bg-pandora-rose text-white' : 'text-pandora-muted hover:text-pandora-rose'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(2)}
                    className={cn(
                      'p-1.5 rounded-sm transition-colors',
                      gridCols === 2 ? 'bg-pandora-rose text-white' : 'text-pandora-muted hover:text-pandora-rose'
                    )}
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={params.sort ?? 'popular'}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                    className="appearance-none pl-3 pr-8 py-2 border border-pandora-border rounded-sm text-sm bg-white text-pandora-text focus:outline-none focus:border-pandora-rose cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-pandora-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filters pills */}
            {(params.category || params.search || params.minPrice || params.colors || params.occasion) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {params.search && (
                  <FilterPill
                    label={`Поиск: "${params.search}"`}
                    onRemove={() => updateParams({ search: undefined })}
                  />
                )}
                {params.category && (
                  <FilterPill
                    label={currentCategory?.name ?? params.category}
                    onRemove={() => updateParams({ category: undefined })}
                  />
                )}
                {(params.minPrice || params.maxPrice) && (
                  <FilterPill
                    label={`${params.minPrice ?? '0'} – ${params.maxPrice ?? '∞'} с`}
                    onRemove={() => updateParams({ minPrice: undefined, maxPrice: undefined })}
                  />
                )}
                {params.colors && (
                  <FilterPill
                    label={FLOWER_COLORS[params.colors] ?? params.colors}
                    onRemove={() => updateParams({ colors: undefined })}
                  />
                )}
                {params.occasion && (
                  <FilterPill
                    label={OCCASIONS[params.occasion] ?? params.occasion}
                    onRemove={() => updateParams({ occasion: undefined })}
                  />
                )}
              </div>
            )}

            {/* Products grid */}
            {initialProducts.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="font-serif text-2xl text-pandora-dark mb-3">
                  Ничего не найдено
                </h3>
                <p className="text-pandora-muted mb-6">
                  Попробуйте изменить фильтры или сбросить поиск
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Показать все букеты
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  'grid gap-4 md:gap-6',
                  gridCols === 3
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2'
                )}
              >
                {initialProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 6} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-pandora-border pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h3 className="font-medium text-pandora-dark text-sm uppercase tracking-wider">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-pandora-muted transition-transform duration-200',
            open ? 'rotate-180' : ''
          )}
        />
      </button>
      {open && <div className="space-y-1">{children}</div>}
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pandora-blush text-pandora-rose text-xs rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-pandora-dark transition-colors">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
