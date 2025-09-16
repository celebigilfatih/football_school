'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Group, groupService } from '@/services/group.service';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function GroupDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await groupService.getById(resolvedParams.id);
        setGroup(data);
        setError(null);
      } catch (err) {
        setError('Grup bilgileri yüklenirken bir hata oluştu');
        console.error('Error fetching group:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
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

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Grup bulunamadı'}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {group.imageUrl && (
            <div className="relative h-[400px] w-full">
              <Image
                src={`${API_URL}${group.imageUrl}`}
                alt={group.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                <p className="text-lg text-gray-600 mt-2">{group.description}</p>
              </div>
              <Link
                href="/groups"
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Geri Dön
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Takım Bilgileri</h2>
                  
                  {group.ageRange && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900">Yaş Aralığı</h3>
                      <p className="text-gray-600">{group.ageRange.min} - {group.ageRange.max} yaş</p>
                    </div>
                  )}
                  
                  {group.capacity && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900">Kapasite</h3>
                      <p className="text-gray-600">{group.capacity} oyuncu</p>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Teknik Direktör</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">{group.trainer.name}</h3>
                    <p className="text-gray-600">{group.trainer.qualification}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Antrenman Programı</h2>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-gray-600">Gün</th>
                        <th className="px-4 py-2 text-left text-gray-600">Başlangıç</th>
                        <th className="px-4 py-2 text-left text-gray-600">Bitiş</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.schedule.map((schedule, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-gray-900">{schedule.day}</td>
                          <td className="px-4 py-2 text-gray-600">{schedule.startTime}</td>
                          <td className="px-4 py-2 text-gray-600">{schedule.endTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {group.players && group.players.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Oyuncular</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.players.map((player, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">
                        {player.firstName} {player.lastName}
                      </h3>
                      <p className="text-gray-600">Doğum Tarihi: {player.birthDate}</p>
                      <p className="text-gray-600">Mevki: {player.position}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                href="/contact"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 