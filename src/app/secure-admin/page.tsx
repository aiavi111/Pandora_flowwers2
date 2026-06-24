'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { PandoraLogoMark } from '@/components/ui/PandoraLogoMark';
import toast from 'react-hot-toast';

interface LoginForm { email: string; password: string; }

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? 'Ошибка входа');
      toast.success('Добро пожаловать!');
      router.push('/secure-admin/dashboard');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen bg-ink-gradient flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <PandoraLogoMark size={56} className="text-porcelain mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-porcelain">Pandora Admin</h1>
          <p className="text-porcelain/45 text-sm mt-1">Панель управления</p>
        </div>

        <div className="bg-white rounded-card shadow-lift p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line">
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-ink">Защищённый вход</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-field">Email</label>
              <input {...register('email', { required: 'Введите email' })} type="email" className="input-field" placeholder="admin@pandora-flowers.kg" autoComplete="email" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-field">Пароль</label>
              <div className="relative">
                <input {...register('password', { required: 'Введите пароль' })} type={showPassword ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-accent transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Войти'}
            </button>
          </form>
        </div>

        <p className="text-porcelain/30 text-xs text-center mt-6">Доступ ограничен авторизованным персоналом</p>
      </div>
    </div>
  );
}
