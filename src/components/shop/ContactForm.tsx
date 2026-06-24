'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) { toast.error('Заполните имя и сообщение'); return; }
    const text = `Здравствуйте! Меня зовут ${name}.${phone ? ` Телефон: ${phone}.` : ''}\n${message}`;
    window.open(`https://wa.me/996772070067?text=${encodeURIComponent(text)}`, '_blank');
    toast.success('Открываем WhatsApp…');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-card border border-line shadow-card p-6 md:p-7 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-ink">Напишите нам</h3>
        <p className="text-sm text-ink-soft mt-1">Ответим в течение 15 минут в рабочее время.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-field" htmlFor="cf-name">Имя</label>
          <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Айгерим" />
        </div>
        <div>
          <label className="label-field" htmlFor="cf-phone">Телефон</label>
          <input id="cf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+996 700 000 000" type="tel" />
        </div>
      </div>
      <div>
        <label className="label-field" htmlFor="cf-msg">Сообщение</label>
        <textarea id="cf-msg" value={message} onChange={(e) => setMessage(e.target.value)} className="input-field resize-none" rows={4} placeholder="Какой букет вас интересует?" />
      </div>
      <button type="submit" className="btn-primary w-full"><Send className="w-4 h-4" /> Отправить в WhatsApp</button>
    </form>
  );
}
