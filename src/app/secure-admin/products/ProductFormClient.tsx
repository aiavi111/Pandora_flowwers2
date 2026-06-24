'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, X } from 'lucide-react';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  composition: string;
  price: number;
  oldPrice: number;
  categoryId: string;
  size: string;
  colors: string;
  flowers: string;
  occasion: string;
  inStock: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  isNew: boolean;
}

interface ProductFormClientProps {
  categories: Category[];
  product?: Partial<ProductFormData> & { id?: string; images?: { url: string }[] };
}

export default function ProductFormClient({ categories, product }: ProductFormClientProps) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((i) => i.url) ?? []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      description: product?.description ?? '',
      composition: product?.composition ?? '',
      price: product?.price ?? 0,
      oldPrice: product?.oldPrice ?? 0,
      categoryId: product?.categoryId ?? '',
      size: product?.size ?? 'medium',
      colors: product?.colors ?? '',
      flowers: product?.flowers ?? '',
      occasion: product?.occasion ?? '',
      inStock: product?.inStock ?? true,
      isPopular: product?.isPopular ?? false,
      isFeatured: product?.isFeatured ?? false,
      isNew: product?.isNew ?? false,
    },
  });

  const nameValue = watch('name');

  const onSubmit = async (data: ProductFormData) => {
    try {
      const body = {
        ...data,
        price: Number(data.price),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        images: imageUrls,
      };

      const res = product?.id
        ? await fetch(`/api/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

      if (!res.ok) throw new Error('Ошибка');

      toast.success(product?.id ? 'Товар обновлён' : 'Товар создан');
      router.push('/secure-admin/products');
      router.refresh();
    } catch {
      toast.error('Ошибка сохранения');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {/* Basic info */}
      <div className="bg-white rounded-sm shadow-sm border border-line p-6">
        <h2 className="font-semibold text-ink mb-5">Основная информация</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Название *</label>
            <input
              {...register('name', { required: 'Введите название' })}
              className="input-field"
              onChange={(e) => {
                setValue('name', e.target.value);
                if (!product?.id) setValue('slug', slugify(e.target.value));
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-ink-soft mb-1.5">URL-slug *</label>
            <input {...register('slug', { required: 'Введите slug' })} className="input-field font-mono text-sm" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Категория *</label>
            <select {...register('categoryId', { required: true })} className="input-field">
              <option value="">Выберите категорию</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Размер</label>
            <select {...register('size')} className="input-field">
              <option value="small">Маленький</option>
              <option value="medium">Средний</option>
              <option value="large">Большой</option>
              <option value="xl">XL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Цена (сом) *</label>
            <input {...register('price', { required: true, min: 1 })} type="number" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Старая цена (сом)</label>
            <input {...register('oldPrice')} type="number" className="input-field" placeholder="0 = нет скидки" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-sm shadow-sm border border-line p-6">
        <h2 className="font-semibold text-ink mb-5">Описание</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Описание *</label>
            <textarea
              {...register('description', { required: true })}
              className="input-field resize-none"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Состав</label>
            <textarea
              {...register('composition')}
              className="input-field resize-none"
              rows={2}
              placeholder="Розы Explorer 25 шт, зелень, упаковка крафт"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm shadow-sm border border-line p-6">
        <h2 className="font-semibold text-ink mb-5">Фильтры и теги</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Цвета (через запятую)</label>
            <input {...register('colors')} className="input-field" placeholder="red,white,pink" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Цветы (через запятую)</label>
            <input {...register('flowers')} className="input-field" placeholder="rose,peony" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1.5">Поводы (через запятую)</label>
            <input {...register('occasion')} className="input-field" placeholder="birthday,romance" />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-sm shadow-sm border border-line p-6">
        <h2 className="font-semibold text-ink mb-5">Фотографии</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="input-field flex-1"
            placeholder="/images/products/<slug>-1.jpg"
          />
          <button
            type="button"
            onClick={() => {
              if (newImageUrl.trim()) {
                setImageUrls((prev) => [...prev, newImageUrl.trim()]);
                setNewImageUrl('');
              }
            }}
            className="px-4 py-2 bg-pandora-rose text-white rounded-sm hover:bg-pandora-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative aspect-square group">
                <img src={url} alt="" className="w-full h-full object-cover rounded-sm" />
                <button
                  type="button"
                  onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <div className="absolute bottom-1 left-1 bg-pandora-rose text-white text-xs px-1.5 py-0.5 rounded-sm">
                    Главное
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flags */}
      <div className="bg-white rounded-sm shadow-sm border border-line p-6">
        <h2 className="font-semibold text-ink mb-5">Статус и теги</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'inStock', label: 'В наличии' },
            { name: 'isPopular', label: 'Популярный' },
            { name: 'isFeatured', label: 'Рекомендуемый' },
            { name: 'isNew', label: 'Новинка' },
          ].map((flag) => (
            <label key={flag.name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register(flag.name as keyof ProductFormData)}
                className="w-4 h-4 accent-pandora-rose"
              />
              <span className="text-sm text-ink-soft">{flag.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {product?.id ? 'Сохранить изменения' : 'Создать товар'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
