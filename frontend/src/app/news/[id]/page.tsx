'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { News, newsService } from '@/services/news.service';

export default function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getById(resolvedParams.id);
        setNews(data);
        setError(null);
      } catch (err) {
        setError('Haber yüklenirken bir hata oluştu');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error || 'Haber bulunamadı'}
            </div>
            <Link
              href="/news"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-4"
            >
              ← Haberlere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article>
        {/* Hero Image */}
        <div className="relative h-[500px]">
          <Image
            src={news.image || '/news-placeholder.svg'}
            alt={news.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/news-placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
            <div className="text-white max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                  {news.category}
                </span>
                <time className="text-sm opacity-75">
                  {new Date(news.publishDate).toLocaleDateString('tr-TR')}
                </time>
              </div>
              <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
              <div className="flex items-center gap-2">
                <span className="opacity-75">Yazar:</span>
                <span className="font-medium">{news.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Content */}
              <div className="prose max-w-none">
                {news.content.split('\n\n').map((paragraph, index) => (
                  <p key={`paragraph-${index}-${paragraph.substring(0, 10)}`} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <h2 className="text-lg font-semibold mb-4">Etiketler</h2>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <span
                      key={`tag-${tag}-${index}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Link
                href="/news"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                ← Haberlere Dön
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}