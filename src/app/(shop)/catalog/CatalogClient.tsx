'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal, ChevronDown, X, LayoutGrid, Grid2X2, Check,
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

const COLOR_HEX: Record<string, string> = {
  red: '#C2575E', white: '#F4F1EC', pink: '#E1A6BC', yellow: '#E7C765',
  orange: '#E0935A', purple: '#9B7BB5', lilac: '#C3AAD9', blue: '#7FA4CB',
  peach: '#EDB78F', cream: '#EFE3CB', green: '#86AE84',
};

interface CatalogClientProps {
  initialProducts: Product[];
  categories: (Category & { _count: { products: number } })[];
  totalCount: number;
  params: {
    category?: string; search?: string; sort?: string;
    minPrice?: string; maxPrice?: string; colors?: string; occasion?: string;
  };
}

export default function CatalogClient({ initialProducts, categories, totalCount, params }: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') current.delete(key);
        else current.set(key, value);
      });
      router.push(`/catalog?${current.toString()}`);
    },
    [router, searchParams],
  );

  const activeFiltersCount = [
    params.category, params.minPrice || params.maxPrice, params.colors, params.occasion,
  ].filter(Boolean).length;

  const clearFilters = () => router.push('/catalog');
  const currentCategory = categories.find((c) => c.slug === params.category);
  const declension = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'букет' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'букета' : 'букетов');

  return (
    <div className="bg-porcelain min-h-screen">
      {/* Page header */}
      <div className="bg-porcelain-fade border-b border-line">
        <div className="container-site py-10 md:py-14">
          <nav className="flex items-center gap-2 text-xs text-ink-muted mb-5">
            <a href="/" className="hover:text-accent transition-colors">Главная</a>
            <span>/</span>
            <span className="text-ink-soft">{currentCategory?.name ?? (params.search ? 'Поиск' : 'Каталог')}</span>
          </nav>
          <div className="section-subtitle mb-3">{params.search ? `Результаты по запросу «${params.search}»` : 'Коллекция Pandora'}</div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-ink">
            {currentCategory?.name ?? (params.search ? 'Поиск букетов' : 'Все букеты')}
          </h1>
          {currentCategory?.description && (
            <p className="text-ink-soft mt-3 max-w-2xl">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="container-site py-10">
        <div className="flex gap-10">
          {/* Mobile overlay */}
          {sidebarOpen && <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* Sidebar */}
          <aside className={cn(
            'fixed md:sticky top-0 md:top-28 left-0 h-full md:h-auto w-80 md:w-60 lg:w-72 bg-porcelain md:bg-transparent z-50 md:z-auto overflow-y-auto md:overflow-visible p-6 md:p-0 shadow-lift md:shadow-none transition-transform duration-400 ease-out-expo flex-shrink-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h2 className="text-lg font-bold text-ink">Фильтры</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-ink-muted"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-7">
              <FilterSection title="Категория">
                <FilterBtn active={!params.category} onClick={() => updateParams({ category: undefined })}
                  label="Все букеты" count={categories.reduce((s, c) => s + c._count.products, 0)} />
                {categories.map((cat) => (
                  <FilterBtn key={cat.id} active={params.category === cat.slug}
                    onClick={() => updateParams({ category: cat.slug })} label={cat.name} count={cat._count.products} />
                ))}
              </FilterSection>

              <FilterSection title="Цена">
                <FilterBtn active={!params.minPrice && !params.maxPrice} onClick={() => updateParams({ minPrice: undefined, maxPrice: undefined })} label="Любая цена" />
                {PRICE_RANGES.map((r) => (
                  <FilterBtn key={r.label} active={params.minPrice === r.min.toString()}
                    onClick={() => updateParams({ minPrice: r.min.toString(), maxPrice: r.max === 999999 ? undefined : r.max.toString() })}
                    label={r.label} />
                ))}
              </FilterSection>

              <FilterSection title="Цвет">
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {Object.entries(FLOWER_COLORS).slice(0, 11).map(([key, label]) => {
                    const isActive = params.colors === key;
                    return (
                      <button key={key} onClick={() => updateParams({ colors: isActive ? undefined : key })} title={label}
                        className={cn('relative w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 border',
                          isActive ? 'ring-2 ring-ink ring-offset-2 ring-offset-porcelain border-transparent scale-110' : 'border-line')}
                        style={{ backgroundColor: COLOR_HEX[key] ?? '#ddd' }}>
                        {isActive && <Check className="w-4 h-4 absolute inset-0 m-auto" style={{ color: key === 'white' || key === 'cream' || key === 'yellow' ? '#1C1714' : '#fff' }} />}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              <FilterSection title="Повод">
                {Object.entries(OCCASIONS).map(([key, label]) => {
                  const checked = params.occasion === key;
                  return (
                    <label key={key} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                      <span className={cn('w-5 h-5 rounded-md border flex items-center justify-center transition-all',
                        checked ? 'bg-ink border-ink' : 'border-line group-hover:border-accent')}>
                        {checked && <Check className="w-3.5 h-3.5 text-porcelain" />}
                      </span>
                      <input type="checkbox" checked={checked} onChange={() => updateParams({ occasion: checked ? undefined : key })} className="sr-only" />
                      <span className={cn('text-sm transition-colors', checked ? 'text-ink font-medium' : 'text-ink-soft group-hover:text-ink')}>{label}</span>
                    </label>
                  );
                })}
              </FilterSection>

              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="btn-outline w-full !py-2.5">
                  <X className="w-4 h-4" /> Сбросить фильтры ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-7">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-line rounded-pill text-sm hover:border-accent transition-colors">
                  <SlidersHorizontal className="w-4 h-4" /> Фильтры
                  {activeFiltersCount > 0 && <span className="w-5 h-5 bg-accent text-white text-xs rounded-full grid place-items-center">{activeFiltersCount}</span>}
                </button>
                <span className="text-ink-soft text-sm">{totalCount} {declension(totalCount)}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1 border border-line rounded-pill p-1">
                  <button onClick={() => setGridCols(4)} className={cn('p-1.5 rounded-full transition-colors', gridCols === 4 ? 'bg-ink text-porcelain' : 'text-ink-muted hover:text-accent')} aria-label="4 в ряд"><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setGridCols(3)} className={cn('p-1.5 rounded-full transition-colors', gridCols === 3 ? 'bg-ink text-porcelain' : 'text-ink-muted hover:text-accent')} aria-label="3 в ряд"><Grid2X2 className="w-4 h-4" /></button>
                </div>
                <div className="relative">
                  <select value={params.sort ?? 'popular'} onChange={(e) => updateParams({ sort: e.target.value })}
                    className="appearance-none pl-4 pr-9 py-2.5 border border-line rounded-pill text-sm bg-white text-ink focus:outline-none focus:border-accent cursor-pointer">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {(params.category || params.search || params.minPrice || params.colors || params.occasion) && (
              <div className="flex flex-wrap gap-2 mb-7">
                {params.search && <Pill label={`«${params.search}»`} onRemove={() => updateParams({ search: undefined })} />}
                {params.category && <Pill label={currentCategory?.name ?? params.category} onRemove={() => updateParams({ category: undefined })} />}
                {(params.minPrice || params.maxPrice) && <Pill label={`${params.minPrice ?? '0'} – ${params.maxPrice ?? '∞'} с`} onRemove={() => updateParams({ minPrice: undefined, maxPrice: undefined })} />}
                {params.colors && <Pill label={FLOWER_COLORS[params.colors] ?? params.colors} onRemove={() => updateParams({ colors: undefined })} />}
                {params.occasion && <Pill label={OCCASIONS[params.occasion] ?? params.occasion} onRemove={() => updateParams({ occasion: undefined })} />}
              </div>
            )}

            {initialProducts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-line rounded-card">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-soft grid place-items-center text-accent-deep text-2xl">✿</div>
                <h3 className="text-xl font-bold text-ink mb-2">Ничего не найдено</h3>
                <p className="text-ink-soft mb-6">Попробуйте изменить фильтры или сбросить поиск.</p>
                <button onClick={clearFilters} className="btn-primary">Показать все букеты</button>
              </div>
            ) : (
              <div className={cn('grid gap-4 md:gap-6', gridCols === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3')}>
                {initialProducts.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 6} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line pb-6">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-3">
        <h3 className="text-xs font-semibold text-ink uppercase tracking-[0.14em]">{title}</h3>
        <ChevronDown className={cn('w-4 h-4 text-ink-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="space-y-1">{children}</div>}
    </div>
  );
}

function FilterBtn({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={cn(
      'w-full text-left py-2 px-3 rounded-input text-sm transition-colors flex items-center justify-between',
      active ? 'bg-ink text-porcelain' : 'text-ink-soft hover:bg-porcelain-deep',
    )}>
      <span>{label}</span>
      {count !== undefined && <span className={cn('text-xs', active ? 'text-porcelain/60' : 'text-ink-muted')}>{count}</span>}
    </button>
  );
}

function Pill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-soft text-accent-deep text-xs rounded-pill font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-ink transition-colors"><X className="w-3 h-3" /></button>
    </span>
  );
}
