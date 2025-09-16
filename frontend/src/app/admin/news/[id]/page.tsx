'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { News, newsService } from '@/services/news.service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type NewsFormData = Omit<News, '_id'>;

export default function AdminNewsForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [news, setNews] = useState<NewsFormData>({
    title: '',
    content: '',
    image: '',
    category: 'Genel',
    author: '',
    isPublished: true,
    publishDate: new Date().toISOString(),
    tags: []
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!isNew) {
          const data = await newsService.getById(resolvedParams.id);
          setNews(data);
        }
        setError(null);
      } catch (err) {
        setError('Haber yüklenirken bir hata oluştu');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [isNew, resolvedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNews(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 800;
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setError(null);
        const compressedImage = await compressImage(file);
        setNews(prev => ({
          ...prev,
          image: compressedImage
        }));
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Görsel yüklenirken bir hata oluştu. Lütfen daha küçük bir görsel deneyin.');
      }
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!news.tags?.includes(tagInput.trim())) {
        setNews(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setNews(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!news.title.trim()) {
        throw new Error('Başlık alanı zorunludur');
      }
      if (!news.content.trim()) {
        throw new Error('İçerik alanı zorunludur');
      }
      if (!news.author.trim()) {
        throw new Error('Yazar alanı zorunludur');
      }

      const formattedNews = {
        title: news.title.trim(),
        content: news.content.trim(),
        author: news.author.trim(),
        category: news.category || 'Genel',
        isPublished: news.isPublished ?? true,
        publishDate: new Date(news.publishDate || new Date()).toISOString(),
        tags: Array.isArray(news.tags) ? news.tags.filter(tag => tag.trim()) : [],
        // Only include image if it's not empty and not the placeholder
        ...(news.image && !news.image.includes('news-placeholder.jpg') ? { image: news.image } : {})
      };

      if (isNew) {
        await newsService.create(formattedNews);
      } else {
        await newsService.update(resolvedParams.id, formattedNews);
      }
      router.push('/admin/news');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Haber kaydedilirken bir hata oluştu');
      }
      console.error('Error saving news:', err);
      setSaving(false);
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isNew ? 'Yeni Haber Ekle' : 'Haberi Düzenle'}
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={news.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              İçerik
            </label>
            <textarea
              id="content"
              name="content"
              value={news.content}
              onChange={handleChange}
              rows={6}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Görsel
            </label>
            <div className="mt-1 flex items-center gap-4">
              {news.image ? (
                <div className="relative w-32 h-32">
                  <Image
                    src={news.image}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                id="category"
                name="category"
                value={news.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Genel">Genel</option>
                <option value="Turnuva">Turnuva</option>
                <option value="Eğitim">Eğitim</option>
                <option value="Başarı">Başarı</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Yazar
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={news.author}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Etiketler
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Enter tuşu ile etiket ekleyin"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {news.tags?.map((tag, index) => (
                  <span
                    key={`tag-${tag}-${index}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={news.isPublished}
                onChange={(e) => setNews(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                Yayınla
              </label>
            </div>

            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                Yayın Tarihi
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={news.publishDate?.toString().split('T')[0]}
                onChange={handleChange}
                required
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/news')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 