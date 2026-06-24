'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, Check, X, Phone, MessageCircle } from 'lucide-react';
import { CustomRequest } from '@/types';
import { formatDateTime, formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Новая',
  reviewing: 'На рассмотрении',
  offer_sent: 'Предложение отправлено',
  accepted: 'Принята',
  rejected: 'Отклонена',
  cancelled: 'Отменена',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  offer_sent: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

interface CustomRequestsClientProps {
  requests: CustomRequest[];
}

export default function CustomRequestsClient({ requests }: CustomRequestsClientProps) {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/custom-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      toast.success('Статус обновлён');
      router.refresh();
    } catch {
      toast.error('Ошибка');
    } finally {
      setUpdating(false);
    }
  };

  const sendOffer = async (id: string) => {
    if (!offerPrice || !offerDescription) {
      toast.error('Заполните цену и описание предложения');
      return;
    }
    setUpdating(true);
    try {
      await fetch(`/api/custom-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'offer_sent',
          offerPrice: parseInt(offerPrice),
          offerDescription,
        }),
      });
      toast.success('Предложение отправлено');
      setOfferPrice('');
      setOfferDescription('');
      setSelectedRequest(null);
      router.refresh();
    } catch {
      toast.error('Ошибка');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* List */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 text-center text-gray-400">
            Заявок пока нет
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className={`bg-white rounded-sm shadow-sm border cursor-pointer transition-all duration-200 ${
                selectedRequest?.id === req.id
                  ? 'border-pandora-rose ring-1 ring-pandora-rose'
                  : 'border-gray-100 hover:border-pandora-rose/50'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm text-gray-800">{req.customerName}</div>
                    <div className="text-xs text-gray-400">{req.customerPhone}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[req.status] ?? 'bg-gray-100 text-gray-600'} text-xs`}>
                    {STATUS_LABELS[req.status] ?? req.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{req.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{req.budget && `Бюджет: ${req.budget}`}</span>
                  <span>{formatDateTime(req.createdAt)}</span>
                </div>
                {req.images.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {req.images.slice(0, 3).map((img) => (
                      <img key={img.id} src={img.url} alt="" className="w-10 h-10 rounded-sm object-cover" />
                    ))}
                    {req.images.length > 3 && (
                      <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-xs text-gray-500">
                        +{req.images.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail */}
      {selectedRequest ? (
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 space-y-5 h-fit sticky top-24">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-800">Заявка от {selectedRequest.customerName}</h3>
            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contact */}
          <div className="flex gap-2">
            <a
              href={`tel:${selectedRequest.customerPhone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-pandora-rose text-white text-xs rounded-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              Позвонить
            </a>
            <a
              href={`https://wa.me/${selectedRequest.customerPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 text-white text-xs rounded-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Details */}
          <div className="text-sm space-y-2">
            <div><span className="text-gray-400">Описание: </span>{selectedRequest.description}</div>
            {selectedRequest.budget && (
              <div><span className="text-gray-400">Бюджет: </span>{selectedRequest.budget} с</div>
            )}
            {selectedRequest.preferredFlowers && (
              <div><span className="text-gray-400">Цветы: </span>{selectedRequest.preferredFlowers}</div>
            )}
            {selectedRequest.preferredColors && (
              <div><span className="text-gray-400">Цвета: </span>{selectedRequest.preferredColors}</div>
            )}
            {selectedRequest.deliveryDate && (
              <div><span className="text-gray-400">Дата: </span>{selectedRequest.deliveryDate}</div>
            )}
            {selectedRequest.additionalNotes && (
              <div><span className="text-gray-400">Примечания: </span>{selectedRequest.additionalNotes}</div>
            )}
          </div>

          {/* Reference photos */}
          {selectedRequest.images.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Референсные фото:</div>
              <div className="grid grid-cols-3 gap-2">
                {selectedRequest.images.map((img) => (
                  <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                    <img src={img.url} alt="" className="w-full aspect-square object-cover rounded-sm hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Send offer */}
          {['pending', 'reviewing'].includes(selectedRequest.status) && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="text-sm font-medium text-gray-700">Отправить предложение:</div>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="input-field text-sm"
                placeholder="Цена (сом)"
              />
              <textarea
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                className="input-field resize-none text-sm"
                rows={3}
                placeholder="Описание предложения..."
              />
              <button
                onClick={() => sendOffer(selectedRequest.id)}
                disabled={updating}
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Отправить предложение
              </button>
            </div>
          )}

          {/* Status buttons */}
          <div className="flex flex-wrap gap-2">
            {selectedRequest.status === 'pending' && (
              <button
                onClick={() => updateStatus(selectedRequest.id, 'reviewing')}
                disabled={updating}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-sm hover:bg-blue-200 transition-colors"
              >
                Взять в работу
              </button>
            )}
            {!['accepted', 'rejected', 'cancelled'].includes(selectedRequest.status) && (
              <button
                onClick={() => updateStatus(selectedRequest.id, 'rejected')}
                disabled={updating}
                className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-sm hover:bg-red-200 transition-colors"
              >
                Отклонить
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 text-center text-gray-400 h-fit">
          <div className="text-3xl mb-3">🌸</div>
          <p>Выберите заявку для просмотра</p>
        </div>
      )}
    </div>
  );
}
