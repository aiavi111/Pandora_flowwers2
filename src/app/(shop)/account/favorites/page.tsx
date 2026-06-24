'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useFavoritesStore } from '@/store/favorites';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types';

export default function FavoritesPage() {
  const { ids } = useFavoritesStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return; }
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : data.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ids]);

  return (
    <div className="bg-porcelain min-h-screen">
      <div className="bg-porcelain-fade border-b border-line">
        <div className="container-site py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-ink-muted hover:text-accent transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Личный кабинет
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">Избранное</h1>
            {ids.length > 0 && <span className="text-ink-muted text-lg">({ids.length})</span>}
          </div>
        </div>
      </div>

      <div className="container-site py-10">
        {ids.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-accent-soft rounded-full grid place-items-center mx-auto mb-6"><Heart className="w-8 h-8 text-accent-deep" strokeWidth={1.4} /></div>
            <h2 className="text-2xl font-bold tracking-tight text-ink mb-3">Список избранного пуст</h2>
            <p className="text-ink-soft mb-8">Нажмите на сердечко на любом букете, чтобы сохранить его здесь.</p>
            <Link href="/catalog" className="btn-primary btn-lg"><ShoppingBag className="w-4 h-4" /> Перейти в каталог</Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {ids.map((id) => (
              <div key={id} className="bg-white rounded-card border border-line overflow-hidden">
                <div className="aspect-[4/5] bg-porcelain-deep animate-pulse" />
                <div className="p-4 space-y-2"><div className="h-4 bg-porcelain-deep rounded w-3/4 animate-pulse" /><div className="h-4 bg-porcelain-deep rounded w-1/2 animate-pulse" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
