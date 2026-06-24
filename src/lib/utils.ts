import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-KG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' с';
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `PF-${year}${month}${day}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created:               'Создан',
  waiting_payment:       'Ожидает оплаты',
  waiting_verification:  'Проверка оплаты',
  paid:                  'Оплачен',
  confirmed:             'Подтверждён',
  preparing:             'Готовится',
  ready:                 'Готов',
  courier_assigned:      'Курьер назначен',
  out_for_delivery:      'Доставляется',
  delivered:             'Доставлен',
  completed:             'Завершён',
  cancelled:             'Отменён',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  created:               'bg-gray-100 text-gray-700',
  waiting_payment:       'bg-yellow-100 text-yellow-700',
  waiting_verification:  'bg-orange-100 text-orange-700',
  paid:                  'bg-blue-100 text-blue-700',
  confirmed:             'bg-indigo-100 text-indigo-700',
  preparing:             'bg-purple-100 text-purple-700',
  ready:                 'bg-teal-100 text-teal-700',
  courier_assigned:      'bg-cyan-100 text-cyan-700',
  out_for_delivery:      'bg-sky-100 text-sky-700',
  delivered:             'bg-emerald-100 text-emerald-700',
  completed:             'bg-green-100 text-green-700',
  cancelled:             'bg-red-100 text-red-700',
};

export const FLOWER_COLORS: Record<string, string> = {
  red:    'Красный',
  white:  'Белый',
  pink:   'Розовый',
  yellow: 'Жёлтый',
  orange: 'Оранжевый',
  purple: 'Фиолетовый',
  lilac:  'Сиреневый',
  blue:   'Синий',
  peach:  'Персиковый',
  cream:  'Кремовый',
  green:  'Зелёный',
  mixed:  'Микс',
};

export const OCCASIONS: Record<string, string> = {
  birthday:    'День рождения',
  anniversary: 'Годовщина',
  romance:     'Романтика',
  wedding:     'Свадьба',
  march8:      '8 марта',
  holiday:     'Праздник',
  housewarming: 'Новоселье',
  condolence:  'Соболезнование',
};

export const DELIVERY_COST = 300;
export const FREE_DELIVERY_THRESHOLD = 5000;
