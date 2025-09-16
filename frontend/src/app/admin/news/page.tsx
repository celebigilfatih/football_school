'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { News, newsService } from '@/services/news.service';

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const data = await newsService.getAll();
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Haberler yüklenirken bir hata oluştu');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleteId(id);
    try {
      await newsService.delete(id);
      await fetchNews();
    } catch (err) {
      setError('Haber silinirken bir hata oluştu');
      console.error('Error deleting news:', err);
    } finally {
      setDeleteId(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Haberler</h1>
        <Link
          href="/admin/news/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Yeni Haber Ekle
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.image || '/news-placeholder.jpg'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {item.category}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.isPublished ? 'Yayında' : 'Taslak'}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <span className="font-medium">{item.author}</span>
                  <span className="mx-2">•</span>
                  <time>{new Date(item.publishDate).toLocaleDateString('tr-TR')}</time>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/news/${item._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deleteId === item._id}
                    className={`text-red-600 hover:text-red-800 ${
                      deleteId === item._id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {deleteId === item._id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Henüz haber bulunmuyor.
        </div>
      )}
    </div>
  );
} 