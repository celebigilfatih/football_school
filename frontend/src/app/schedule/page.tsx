'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Group, groupService } from '@/services/group.service';

export default function Schedule() {
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
        setError('Antrenman programı yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
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
          <div className="flex justify-center">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 max-w-lg mx-auto">
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
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Antrenman Programı</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tüm yaş gruplarımızın haftalık antrenman saatleri ve programları
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-600 mb-4">
                  {group.ageRange ? `${group.ageRange.min} - ${group.ageRange.max} yaş` : 'Yaş aralığı belirtilmemiş'}
                </p>
                
                {group.schedule && group.schedule.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Antrenman Saatleri:</h4>
                    {group.schedule.map((schedule, index) => (
                      <div key={`schedule-${group._id}-${schedule.day}-${index}`} 
                           className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{schedule.day}</span>
                        <span className="text-gray-600">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Henüz antrenman programı belirlenmemiş.</p>
                )}

                {group.trainer && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Antrenör:</span> {group.trainer.name}
                    </p>
                    {group.trainer.qualification && (
                      <p className="text-sm text-gray-500">
                        {group.trainer.qualification}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz antrenman programı bulunmuyor.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}