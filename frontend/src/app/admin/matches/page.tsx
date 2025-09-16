'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Match, matchService } from '@/services/match.service';
import { Button } from '@/components/ui/button';

export default function AdminMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await matchService.getAll();
      setMatches(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.response?.data?.message || 'Maçlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu maçı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await matchService.delete(id);
      setMatches(matches.filter(match => match._id !== id));
    } catch (err: any) {
      console.error('Error deleting match:', err);
      alert(err.response?.data?.message || 'Maç silinirken bir hata oluştu');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Planlandı';
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
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Maç Takvimi</h1>
        <Link href="/admin/matches/new">
          <Button>
            Yeni Maç Ekle
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih/Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ev Sahibi
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deplasman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saha
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
            {matches.map((match) => (
              <tr key={match._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(match.date), 'd MMMM yyyy', { locale: tr })}
                  <br />
                  <span className="text-gray-500">{match.time}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {match.homeTeam}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {match.status === 'completed' ? (
                    <span className="font-semibold">
                      {match.score.homeTeam} - {match.score.awayTeam}
                    </span>
                  ) : (
                    <span className="text-gray-500">VS</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {match.awayTeam}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {match.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(match.status)}`}>
                    {getStatusText(match.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/matches/${match._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(match._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 