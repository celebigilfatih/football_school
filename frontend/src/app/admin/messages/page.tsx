'use client';

import { useEffect, useState } from 'react';
import { ContactMessage, contactService } from '@/services/contact.service';

const statusColors = {
  'new': 'bg-blue-100 text-blue-800',
  'read': 'bg-gray-100 text-gray-800',
  'replied': 'bg-green-100 text-green-800',
  'archived': 'bg-yellow-100 text-yellow-800'
} as const;

const subjectLabels = {
  'registration': 'Kayıt',
  'info': 'Bilgi Alma',
  'complaint': 'Şikayet/Öneri',
  'other': 'Diğer'
} as const;

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await contactService.getAllMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Mesajlar yüklenirken bir hata oluştu');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleteId(id);
    try {
      await contactService.deleteMessage(id);
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError('Mesaj silinirken bir hata oluştu');
      console.error('Error deleting message:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (message: ContactMessage, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      await contactService.updateMessage(message.id, { ...message, status: newStatus });
      await fetchMessages();
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...message, status: newStatus });
      }
    } catch (err) {
      setError('Mesaj durumu güncellenirken bir hata oluştu');
      console.error('Error updating message status:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-500">{message.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[message.status]}`}>
                    {message.status === 'new' ? 'Yeni' :
                     message.status === 'read' ? 'Okundu' :
                     message.status === 'replied' ? 'Yanıtlandı' : 'Arşivlendi'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {subjectLabels[message.subject]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>

          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Henüz mesaj bulunmuyor.
            </div>
          )}
        </div>

        {/* Message Detail */}
        {selectedMessage ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedMessage.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{selectedMessage.email}</span>
                  <span>•</span>
                  <span>{selectedMessage.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleStatusChange(selectedMessage, e.target.value as any)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="new">Yeni</option>
                  <option value="read">Okundu</option>
                  <option value="replied">Yanıtlandı</option>
                  <option value="archived">Arşivlendi</option>
                </select>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={deleteId === selectedMessage.id}
                  className={`text-red-600 hover:text-red-800 ${
                    deleteId === selectedMessage.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {deleteId === selectedMessage.id ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                {subjectLabels[selectedMessage.subject]}
              </span>
              <time className="text-sm text-gray-500 ml-2">
                {new Date(selectedMessage.createdAt).toLocaleString('tr-TR')}
              </time>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-500">
            Detayları görüntülemek için bir mesaj seçin
          </div>
        )}
      </div>
    </div>
  );
} 