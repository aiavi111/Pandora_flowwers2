import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Eye } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton';

async function getProducts() {
  return prisma.product.findMany({
    include: {
      images: { take: 1 },
      category: true,
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <AdminShell
      title="Товары"
      subtitle={`${products.length} позиций`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          <Link href="/secure-admin/products" className="px-3 py-1.5 bg-pandora-rose text-white text-xs rounded-sm">
            Все ({products.length})
          </Link>
          {categories.map((cat) => (
            <span key={cat.id} className="px-3 py-1.5 bg-porcelain-deep text-ink-soft text-xs rounded-sm">
              {cat.name}
            </span>
          ))}
        </div>
        <Link href="/secure-admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-pandora-rose text-white text-sm rounded-sm hover:bg-pandora-dark transition-colors">
          <Plus className="w-4 h-4" />
          Добавить товар
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-porcelain-deep border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-ink-soft font-medium">Товар</th>
                <th className="text-left px-4 py-3 text-ink-soft font-medium">Категория</th>
                <th className="text-left px-4 py-3 text-ink-soft font-medium">Цена</th>
                <th className="text-left px-4 py-3 text-ink-soft font-medium">В наличии</th>
                <th className="text-left px-4 py-3 text-ink-soft font-medium">Заказы</th>
                <th className="w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => {
                const image = product.images[0]?.url;
                return (
                  <tr key={product.id} className="hover:bg-porcelain-deep transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {image && (
                          <div className="w-10 h-12 rounded-sm overflow-hidden flex-shrink-0">
                            <Image src={image} alt={product.name} width={40} height={48} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-ink text-sm line-clamp-1">{product.name}</div>
                          <div className="text-xs text-ink-muted font-mono">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{product.category?.name}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{formatPrice(product.price)}</div>
                      {product.oldPrice && (
                        <div className="text-xs text-ink-muted line-through">{formatPrice(product.oldPrice)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${
                        product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{product._count.orderItems}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-ink-muted hover:text-pandora-rose transition-colors"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/secure-admin/products/${product.id}`}
                          className="p-1.5 text-ink-muted hover:text-pandora-rose transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
