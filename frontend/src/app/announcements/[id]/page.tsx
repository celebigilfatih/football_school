'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Announcement, announcementService } from '@/services/announcement.service';
import Image from 'next/image';

const priorityColors: Record<Announcement['priority'], string> = {
  'Düşük': 'bg-gray-100 text-gray-800',
  'Normal': 'bg-blue-100 text-blue-800',
  'Yüksek': 'bg-orange-100 text-orange-800',
  'Acil': 'bg-red-100 text-red-800'
};

export default function AnnouncementDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await announcementService.getById(resolvedParams.id);
        setAnnouncement(data);
        setError(null);
      } catch (err) {
        setError('Duyuru yüklenirken bir hata oluştu');
        console.error('Error fetching announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
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
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error || 'Duyuru bulunamadı'}
            </div>
            <Link
              href="/announcements"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Duyurulara Dön
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article>
        {/* Hero Image */}
        <div className="relative h-[300px]">
          <Image
            src="/match.jpg"
            alt={announcement.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
            <div className="text-white max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[announcement.priority]}`}>
                  {announcement.priority}
                </span>
                <time className="text-sm opacity-75">
                  {new Date(announcement.startDate).toLocaleDateString('tr-TR')}
                </time>
              </div>
              <h1 className="text-4xl font-bold mb-4">{announcement.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="opacity-75">Başlangıç:</span>
                  <time className="font-medium">{new Date(announcement.startDate).toLocaleDateString('tr-TR')}</time>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-75">Bitiş:</span>
                  <time className="font-medium">{new Date(announcement.endDate).toLocaleDateString('tr-TR')}</time>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Target Groups */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Hedef Gruplar</h2>
                <div className="flex flex-wrap gap-2">
                  {announcement.targetGroups
                    .filter(group => group !== null && group !== undefined)
                    .map((group, index) => (
                      <span
                        key={typeof group === 'string' ? `group-${group}-${index}` : `group-${group._id || index}`}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {typeof group === 'string' ? group : (group?.name || 'Grup')}
                      </span>
                    ))}
                </div>
              </div>

              {/* Content */}
              <div className="prose max-w-none">
                {announcement.content.split('\n\n').map((paragraph, index) => (
                  <p key={`paragraph-${index}-${paragraph.substring(0, 10)}`} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <Link
                href="/announcements"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Duyurulara Dön
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
} 