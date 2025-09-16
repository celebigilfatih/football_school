'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Announcement, announcementService } from '@/services/announcement.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const priorityColors = {
  'Düşük': 'bg-gray-100 text-gray-800',
  'Normal': 'bg-blue-100 text-blue-800',
  'Yüksek': 'bg-orange-100 text-orange-800',
  'Acil': 'bg-red-100 text-red-800'
} as const;

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError('Duyurular yüklenirken bir hata oluştu');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleteId(id);
    try {
      await announcementService.delete(id);
      await fetchAnnouncements();
    } catch (err) {
      setError('Duyuru silinirken bir hata oluştu');
      console.error('Error deleting announcement:', err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !selectedPriority || item.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
            <p className="text-gray-500 text-sm mt-1">Duyuruları yönetin ve düzenleyin</p>
          </div>
          <Link
            href="/admin/announcements/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Duyuru Ekle
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Duyurularda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
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
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Announcements */}
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">Aradığınız kriterlere uygun duyuru bulunamadı.</div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement._id || `announcement-${Math.random()}`} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[announcement.priority]}`}>
                      {announcement.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      announcement.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {announcement.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{announcement.content}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {announcement.targetGroups?.filter(group => group !== null && group !== undefined)
                      .map((group, index) => (
                      <span
                        key={typeof group === 'string' ? `group-${group}-${index}` : `group-${group?._id || index}`}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                      >
                        {typeof group === 'string' ? group : (group?.name || 'Grup')}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <div>Başlangıç: {new Date(announcement.startDate).toLocaleDateString('tr-TR')}</div>
                    <div>Bitiş: {new Date(announcement.endDate).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/announcements/${announcement._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => announcement._id && handleDelete(announcement._id)}
                      disabled={deleteId === announcement._id}
                      className={`text-red-600 hover:text-red-900 ${
                        deleteId === announcement._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {deleteId === announcement._id ? 'Siliniyor...' : 'Sil'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Öncelik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih Aralığı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hedef Gruplar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAnnouncements.map((announcement) => (
                    <tr key={announcement._id || `announcement-list-${Math.random()}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{announcement.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          priorityColors[announcement.priority]
                        }`}>
                          {announcement.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(announcement.startDate).toLocaleDateString('tr-TR')}</div>
                        <div>{new Date(announcement.endDate).toLocaleDateString('tr-TR')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {announcement.targetGroups?.filter(group => group !== null && group !== undefined)
                            .map((group, index) => (
                            <span
                              key={typeof group === 'string' ? `list-group-${group}-${index}` : `list-group-${group?._id || index}`}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                            >
                              {typeof group === 'string' ? group : (group?.name || 'Grup')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          announcement.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {announcement.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/announcements/${announcement._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => announcement._id && handleDelete(announcement._id)}
                          disabled={deleteId === announcement._id}
                          className={`text-red-600 hover:text-red-900 ${
                            deleteId === announcement._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deleteId === announcement._id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 