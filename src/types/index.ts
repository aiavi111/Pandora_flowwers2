export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  composition?: string | null;
  price: number;
  oldPrice?: number | null;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  size?: string | null;
  colors?: string | null;
  flowers?: string | null;
  occasion?: string | null;
  inStock: boolean;
  stockCount: number;
  isPopular: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  reviews?: Review[];
  _count?: { reviews: number };
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  createdAt: Date | string;
}

export interface Address {
  id: string;
  customerId: string;
  name: string;
  street: string;
  apartment?: string | null;
  district?: string | null;
  city: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string | null;
  deliveryDate?: string | null;
  deliveryTime?: string | null;
  recipientName?: string | null;
  recipientPhone?: string | null;
  greetingCard?: string | null;
  isAnonymous: boolean;
  specialNotes?: string | null;
  paymentMethod: 'card' | 'qr';
  paymentStatus: string;
  receiptImage?: string | null;
  status: OrderStatus;
  subtotal: number;
  deliveryCost: number;
  total: number;
  adminNotes?: string | null;
  courierId?: string | null;
  items: OrderItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type OrderStatus =
  | 'created'
  | 'waiting_payment'
  | 'waiting_verification'
  | 'paid'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'courier_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

export interface Review {
  id: string;
  customerId: string;
  customer?: Customer;
  productId: string;
  rating: number;
  text?: string | null;
  isApproved: boolean;
  createdAt: Date | string;
}

export interface CustomRequest {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  description: string;
  budget?: number | null;
  preferredFlowers?: string | null;
  preferredColors?: string | null;
  deliveryDate?: string | null;
  additionalNotes?: string | null;
  status: string;
  offerPrice?: number | null;
  offerDescription?: string | null;
  offerImageUrl?: string | null;
  images: { id: string; url: string }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  revenueToday: number;
  revenueMonth: number;
  revenueYear: number;
  ordersToday: number;
  pendingOrders: number;
  pendingPayments: number;
  averageOrderValue: number;
  totalCustomers: number;
  topProducts: { name: string; count: number; revenue: number }[];
}
