'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetDataButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка');
      toast.success('Данные очищены');
      setOpen(false);
      setConfirmText('');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Не удалось очистить');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mt-8 bg-white rounded-card border border-red-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-red-50 grid place-items-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="font-semibold text-ink">Очистить данные</div>
            <div className="text-sm text-ink-muted">Удалит все заказы, заявки, отзывы и клиентов. Товары и категории останутся. Действие необратимо.</div>
          </div>
        </div>
        <button onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-pill border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors whitespace-nowrap">
          <Trash2 className="w-4 h-4" /> Очистить
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => !busy && setOpen(false)} />
          <div className="relative bg-white rounded-card shadow-lift w-full max-w-md p-6">
            <button onClick={() => !busy && setOpen(false)} className="absolute top-4 right-4 text-ink-muted hover:text-ink"><X className="w-5 h-5" /></button>
            <div className="w-12 h-12 rounded-full bg-red-50 grid place-items-center mb-4"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-lg font-bold text-ink mb-2">Очистить все данные?</h3>
            <p className="text-sm text-ink-soft mb-4">
              Будут безвозвратно удалены: <b>заказы, заявки на букеты, отзывы, клиенты и уведомления</b>.
              Товары, категории и доступ в админку — сохранятся.
            </p>
            <label className="block text-sm text-ink-soft mb-2">Для подтверждения напишите <b>ОЧИСТИТЬ</b>:</label>
            <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="input-field mb-5" placeholder="ОЧИСТИТЬ" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => { setOpen(false); setConfirmText(''); }} className="btn-outline flex-1" disabled={busy}>Отмена</button>
              <button onClick={reset} disabled={busy || confirmText.trim().toUpperCase() !== 'ОЧИСТИТЬ'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-pill bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-40 disabled:pointer-events-none">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Очистить всё
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
