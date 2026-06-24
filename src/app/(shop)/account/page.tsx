'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { User, Package, Heart, LogIn, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function AccountPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  const onLogin = async (data: LoginForm) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Ошибка входа');
      setUser(result.customer);
      setIsLoggedIn(true);
      toast.success('Добро пожаловать!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка входа');
    }
  };

  const onRegister = async (data: RegisterForm) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Ошибка регистрации');
      setUser(result.customer);
      setIsLoggedIn(true);
      toast.success('Аккаунт создан!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка регистрации');
    }
  };

  if (isLoggedIn && user) {
    return (
      <div className="bg-pandora-cream min-h-screen">
        <div className="bg-white border-b border-pandora-border">
          <div className="container-site py-8">
            <h1 className="section-title">Личный кабинет</h1>
            <p className="text-pandora-muted mt-1">Добро пожаловать, {user.name}!</p>
          </div>
        </div>
        <div className="container-site py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Package className="w-8 h-8 text-pandora-rose" />,
                title: 'Мои заказы',
                desc: 'Отслеживайте статус заказов',
                href: '/account/orders',
              },
              {
                icon: <Heart className="w-8 h-8 text-pandora-rose" />,
                title: 'Избранное',
                desc: 'Сохранённые букеты',
                href: '/account/favorites',
              },
              {
                icon: <User className="w-8 h-8 text-pandora-rose" />,
                title: 'Профиль',
                desc: 'Данные и адреса доставки',
                href: '/account/profile',
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="bg-white rounded-sm shadow-card p-6 hover:shadow-card-hover transition-shadow group">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
                <h2 className="font-serif text-xl text-pandora-dark mb-2">{item.title}</h2>
                <p className="text-pandora-muted text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pandora-cream min-h-screen py-12">
      <div className="container-site max-w-md">
        {/* Toggle */}
        <div className="flex bg-white rounded-sm shadow-card p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-medium rounded-sm transition-all duration-200 ${
              mode === 'login' ? 'bg-pandora-rose text-white' : 'text-pandora-muted hover:text-pandora-rose'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Вход
            </span>
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-medium rounded-sm transition-all duration-200 ${
              mode === 'register' ? 'bg-pandora-rose text-white' : 'text-pandora-muted hover:text-pandora-rose'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Регистрация
            </span>
          </button>
        </div>

        <div className="bg-white rounded-sm shadow-card p-8">
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-pandora-rose rounded-sm flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-serif text-xl font-bold">P</span>
                </div>
                <h2 className="font-serif text-2xl text-pandora-dark">Добро пожаловать</h2>
                <p className="text-pandora-muted text-sm mt-1">Войдите в свой аккаунт</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-pandora-text mb-2">Email</label>
                <input
                  {...loginForm.register('email', { required: 'Введите email' })}
                  type="email"
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pandora-text mb-2">Пароль</label>
                <input
                  {...loginForm.register('password', { required: 'Введите пароль' })}
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="btn-primary w-full justify-center py-3.5 disabled:opacity-50"
              >
                {loginForm.formState.isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-pandora-rose rounded-sm flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-serif text-xl font-bold">P</span>
                </div>
                <h2 className="font-serif text-2xl text-pandora-dark">Создать аккаунт</h2>
                <p className="text-pandora-muted text-sm mt-1">Отслеживайте заказы и сохраняйте избранное</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-pandora-text mb-2">Имя *</label>
                <input
                  {...registerForm.register('name', { required: 'Введите имя' })}
                  className="input-field"
                  placeholder="Айгерим"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pandora-text mb-2">Email *</label>
                <input
                  {...registerForm.register('email', { required: 'Введите email' })}
                  type="email"
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pandora-text mb-2">Телефон</label>
                <input
                  {...registerForm.register('phone')}
                  type="tel"
                  className="input-field"
                  placeholder="+996 700 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pandora-text mb-2">Пароль *</label>
                <input
                  {...registerForm.register('password', { required: 'Введите пароль', minLength: { value: 6, message: 'Минимум 6 символов' } })}
                  type="password"
                  className="input-field"
                  placeholder="Минимум 6 символов"
                />
              </div>

              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="btn-primary w-full justify-center py-3.5 disabled:opacity-50"
              >
                {registerForm.formState.isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Создать аккаунт'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
