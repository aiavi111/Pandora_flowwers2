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
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ids]);

  return (
    <div className="bg-pandora-cream min-h-screen">
      <div className="bg-white border-b border-pandora-border">
        <div className="container-site py-8">
          <Link
            href="/account"
            className="flex items-center gap-2 text-pandora-muted hover:text-pandora-rose transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Личный кабинет
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pandora-rose" />
            <h1 className="section-title">Избранное</h1>
            <span className="text-pandora-muted text-sm">({ids.length})</span>
          </div>
        </div>
      </div>

      <div className="container-site py-10">
        {ids.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-pandora-blush/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-pandora-rose/40" />
            </div>
            <h2 className="font-serif text-2xl text-pandora-dark mb-3">
              Список избранного пуст
            </h2>
            <p className="text-pandora-muted mb-8">
              Нажмите ❤️ на любом букете, чтобы сохранить его здесь
            </p>
            <Link href="/catalog" className="btn-primary">
              <ShoppingBag className="w-4 h-4" />
              Перейти в каталог
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {ids.map((id) => (
              <div key={id} className="bg-white rounded-sm shadow-card animate-pulse">
                <div className="aspect-[3/4] bg-pandora-blush/30" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-pandora-border rounded w-3/4" />
                  <div className="h-4 bg-pandora-border rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
