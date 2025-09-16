'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Announcement, announcementService } from '@/services/announcement.service';

const priorityColors = {
  'Düşük': 'bg-gray-100 text-gray-800',
  'Normal': 'bg-blue-100 text-blue-800',
  'Yüksek': 'bg-orange-100 text-orange-800',
  'Acil': 'bg-red-100 text-red-800'
} as const;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAll();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        setError('Duyurular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !selectedPriority || item.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px]">
        <div className="absolute inset-0">
          <Image
            src="/match.jpg"
            alt="Announcements"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <h1 className="text-5xl font-bold text-white">Duyurular</h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Duyurularda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="Düşük">Düşük</option>
              <option value="Normal">Normal</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Acil">Acil</option>
            </select>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center text-gray-500">
              Aradığınız kriterlere uygun duyuru bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <Card key={announcement._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[announcement.priority]}`}>
                        {announcement.priority}
                      </span>
                      <time className="text-sm text-gray-500">
                        {new Date(announcement.startDate).toLocaleDateString('tr-TR')}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold">{announcement.title}</h3>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">{announcement.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {announcement.targetGroups
                        .filter(group => group !== null && group !== undefined)
                        .map((group, index) => (
                          <span
                            key={typeof group === 'string' ? `group-${group}-${index}` : `group-${group._id || index}`}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {typeof group === 'string' ? group : (group?.name || 'Grup')}
                          </span>
                        ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Bitiş: {new Date(announcement.endDate).toLocaleDateString('tr-TR')}
                    </div>
                    <Link
                      href={`/announcements/${announcement._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                      Detayları Gör
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 