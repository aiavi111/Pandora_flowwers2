'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BrandImage } from '@/components/ui/BrandImage';
import { useForm } from 'react-hook-form';
import { Upload, X, CheckCircle, Loader2, Flower2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FLOWER_OPTIONS = ['Розы', 'Пионы', 'Тюльпаны', 'Орхидеи', 'Гортензии', 'Эустома', 'Ранункулюс', 'Хризантемы', 'Полевые цветы'];
const COLOR_OPTIONS = ['Красный', 'Розовый', 'Белый', 'Кремовый', 'Жёлтый', 'Оранжевый', 'Сиреневый', 'Бордовый'];
const BUDGET_OPTIONS = ['До 2 000 с', '2 000–5 000 с', '5 000–10 000 с', '10 000–20 000 с', 'Свыше 20 000 с'];

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  description: string;
  preferredFlowers: string[];
  preferredColors: string[];
  budget: string;
  deliveryDate: string;
  additionalNotes: string;
}

export default function CustomPage() {
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 10) {
      toast.error('Максимум 10 фотографий');
      return;
    }
    setUploading(true);
    // Simulate upload - just use object URLs for now
    const urls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls].slice(0, 10));
    setUploading(false);
    toast.success(`${files.length} фото добавлено`);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFlower = (flower: string) => {
    setSelectedFlowers((prev) =>
      prev.includes(flower) ? prev.filter((f) => f !== flower) : [...prev, flower]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          preferredFlowers: selectedFlowers.join(', '),
          preferredColors: selectedColors.join(', '),
          images,
        }),
      });

      if (!response.ok) throw new Error('Ошибка отправки');

      setSubmitted(true);
      reset();
      setImages([]);
      setSelectedFlowers([]);
      setSelectedColors([]);
    } catch {
      toast.error('Ошибка при отправке. Попробуйте ещё раз или свяжитесь с нами по телефону.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl text-pandora-dark mb-3">
            Заявка отправлена!
          </h2>
          <p className="text-pandora-muted mb-6 leading-relaxed">
            Наш флорист рассмотрит вашу заявку и свяжется с вами в течение 30 минут для согласования деталей и стоимости.
          </p>
          <div className="bg-pandora-blush/30 rounded-sm p-4 mb-8 text-sm text-pandora-text">
            <strong>Что дальше?</strong><br />
            1. Флорист свяжется с вами<br />
            2. Вы получите фото + цену<br />
            3. После подтверждения — начнём работу
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-secondary"
          >
            Отправить ещё заявку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-porcelain">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-ink-gradient" />
        <div className="absolute inset-0 opacity-25">
          <BrandImage src="/images/hero/custom-1.jpg" alt="Букет на заказ" tone="ink" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        <div className="relative z-10 container-site text-center text-white">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-pandora-gold" />
            <span className="text-pandora-gold text-xs tracking-[0.3em] uppercase">Авторский сервис</span>
            <span className="w-8 h-px bg-pandora-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl text-white font-bold tracking-tight mb-4">
            Букет на заказ
          </h1>
          <p className="text-pandora-blush/80 text-lg max-w-lg mx-auto">
            Опишите вашу мечту — наши флористы создадут уникальный авторский букет за 2 часа
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="container-site max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact */}
            <div className="bg-white rounded-sm shadow-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-pandora-rose rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <h2 className="text-2xl text-pandora-dark">Контактные данные</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Ваше имя *
                  </label>
                  <input
                    {...register('customerName', { required: 'Введите имя' })}
                    className="input-field"
                    placeholder="Айгерим"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Телефон *
                  </label>
                  <input
                    {...register('customerPhone', { required: 'Введите номер телефона' })}
                    className="input-field"
                    placeholder="+996 700 000 000"
                    type="tel"
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Email (необязательно)
                  </label>
                  <input
                    {...register('customerEmail')}
                    className="input-field"
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
              </div>
            </div>

            {/* Bouquet description */}
            <div className="bg-white rounded-sm shadow-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-pandora-rose rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h2 className="text-2xl text-pandora-dark">Описание букета</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Расскажите о букете вашей мечты *
                  </label>
                  <textarea
                    {...register('description', { required: 'Опишите желаемый букет' })}
                    className="input-field resize-none"
                    rows={4}
                    placeholder="Например: хочу нежный букет в пудровых тонах с пионами и розами, для подарка маме на день рождения. Что-то утончённое и женственное..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Flowers */}
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-3">
                    Предпочтительные цветы
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FLOWER_OPTIONS.map((flower) => (
                      <button
                        key={flower}
                        type="button"
                        onClick={() => toggleFlower(flower)}
                        className={`px-3 py-1.5 rounded-sm text-sm border transition-all duration-200 ${
                          selectedFlowers.includes(flower)
                            ? 'bg-pandora-rose text-white border-pandora-rose'
                            : 'border-pandora-border text-pandora-text hover:border-pandora-rose'
                        }`}
                      >
                        {flower}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-3">
                    Предпочтительные цвета
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-sm text-sm border transition-all duration-200 ${
                          selectedColors.includes(color)
                            ? 'bg-pandora-rose text-white border-pandora-rose'
                            : 'border-pandora-border text-pandora-text hover:border-pandora-rose'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Бюджет
                  </label>
                  <select
                    {...register('budget')}
                    className="input-field"
                  >
                    <option value="">Выберите диапазон</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Delivery date */}
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Желаемая дата получения
                  </label>
                  <input
                    {...register('deliveryDate')}
                    type="date"
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-pandora-text mb-2">
                    Дополнительные пожелания
                  </label>
                  <textarea
                    {...register('additionalNotes')}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Открытка с текстом, анонимная доставка, особые пожелания..."
                  />
                </div>
              </div>
            </div>

            {/* Reference photos */}
            <div className="bg-white rounded-sm shadow-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-pandora-rose rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <h2 className="text-2xl text-pandora-dark">Фото для вдохновения</h2>
              </div>
              <p className="text-pandora-muted text-sm mb-4">
                Загрузите до 10 фотографий, которые помогут нашему флористу понять ваш вкус
              </p>

              {/* Upload area */}
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-pandora-border rounded-sm p-8 text-center hover:border-pandora-rose transition-colors duration-200">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-pandora-rose mx-auto mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-pandora-muted mx-auto mb-2" />
                  )}
                  <div className="text-sm text-pandora-muted">
                    <span className="text-pandora-rose font-medium">Нажмите для загрузки</span> или перетащите сюда
                  </div>
                  <div className="text-xs text-pandora-muted mt-1">PNG, JPG до 10 МБ каждый</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={images.length >= 10}
                />
              </label>

              {/* Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-sm overflow-hidden group">
                      <Image src={url} alt="" fill sizes="100px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-pandora-muted mt-2">
                {images.length}/10 фотографий
              </div>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Flower2 className="w-5 h-5" />
                    Отправить заявку
                  </>
                )}
              </button>
              <p className="text-pandora-muted text-sm mt-4">
                Наш флорист свяжется с вами в течение 30 минут
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
