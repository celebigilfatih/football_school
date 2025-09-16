'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Group, groupService } from '@/services/group.service';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getAll();
        setGroups(data);
        setError(null);
      } catch (err) {
        setError('Gruplar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px]">
        <div className="absolute inset-0">
          <Image
            src="/match.jpg"
            alt="Football Teams"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <h1 className="text-4xl font-bold text-white">Alt Yapı Takımlarımız</h1>
        </div>
      </section>

      {/* Groups List */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {groups.map((group) => (
              <div key={group._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {group.imageUrl && (
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={`${API_URL}${group.imageUrl}`}
                      alt={group.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  
                  <div className="space-y-4">
                    {group.ageRange && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Yaş Aralığı</h3>
                        <p className="text-gray-600">{group.ageRange.min} - {group.ageRange.max} yaş</p>
                      </div>
                    )}
                    
                    {group.capacity && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Kapasite</h3>
                        <p className="text-gray-600">{group.capacity} oyuncu</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">Antrenman Saatleri</h3>
                      <div className="space-y-2">
                        {group.schedule.map((schedule, index) => (
                          <p key={`schedule-${group._id}-${schedule.day}-${index}`} className="text-gray-600">
                            {schedule.day}: {schedule.startTime} - {schedule.endTime}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">Teknik Direktör</h3>
                      <p className="text-gray-600">
                        {group.trainer.name} - {group.trainer.qualification}
                      </p>
                    </div>
                  </div>

                  <Link 
                    href={`/groups/${group._id}`}
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Detaylar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 