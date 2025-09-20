'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Group, groupService } from '@/services/group.service';
import Link from 'next/link';
import { BASE_URL } from '@/config';

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageRetryCount, setImageRetryCount] = useState<{[key: string]: number}>({});

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, group: Group) => {
    const usedUrl = (group.imageUrl?.startsWith('blob:') || group.imageUrl?.startsWith('data:') || group.imageUrl?.startsWith('http')) ? `${group.imageUrl}` : `${BASE_URL}${group.imageUrl}`;
    const retryCount = imageRetryCount[group._id] || 0;
    
    console.group('🖼️ Image Load Error Details (Groups List)');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Group ID:', group._id);
    console.error('Group name:', group.name);
    console.error('Original imageUrl:', group.imageUrl);
    console.error('Constructed URL:', usedUrl);
    console.error('Retry count:', retryCount);
    console.error('Error event:', e);
    console.error('Navigator online:', navigator.onLine);
    console.groupEnd();
    
    // Try retry with cache-busting if we haven't retried too many times
    if (retryCount < 2) {
      console.log(`🔄 Retrying image load for ${group.name} (attempt ${retryCount + 1}/2) with cache-busting...`);
      const img = e.target as HTMLImageElement;
      const cacheBustUrl = usedUrl + (usedUrl.includes('?') ? '&' : '?') + `t=${Date.now()}&retry=${retryCount + 1}`;
      img.src = cacheBustUrl;
      setImageRetryCount(prev => ({...prev, [group._id]: retryCount + 1}));
      return;
    }
    
    // After max retries, check if image actually loaded
    setTimeout(() => {
      console.log(`🔄 Final check if image loaded after error for ${group.name}...`);
      const img = e.target as HTMLImageElement;
      if (img.complete && img.naturalWidth === 0) {
        console.log('❌ Image permanently failed, hiding container');
        img.parentElement!.style.display = 'none';
      } else if (img.complete && img.naturalWidth > 0) {
        console.log('✅ Image actually loaded successfully after error!');
      }
    }, 1000);
  };

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
                {group.imageUrl ? (
                  <div className="relative h-[200px] w-full">
                    <img
                        src={(group.imageUrl?.startsWith('blob:') || group.imageUrl?.startsWith('data:') || group.imageUrl?.startsWith('http')) ? `${group.imageUrl}` : `${BASE_URL}${group.imageUrl}`}
                        alt={group.name}
                        className="object-cover w-full h-full"
                        onError={(e) => handleImageError(e, group)}
                      />
                  </div>
                ) : (
                  <div className="relative h-[200px] w-full bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">Resim yükleniyor...</p>
                    </div>
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


const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, group: Group) => {
  const usedUrl = (group.imageUrl?.startsWith('blob:') || group.imageUrl?.startsWith('data:') || group.imageUrl?.startsWith('http')) ? `${group.imageUrl}` : `${BASE_URL}${group.imageUrl}`;
  const retryCount = imageRetryCount[group._id] || 0;
  
  console.group('🖼️ Image Load Error Details (Groups List)');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Group ID:', group._id);
  console.error('Group name:', group.name);
  console.error('Original imageUrl:', group.imageUrl);
  console.error('Constructed URL:', usedUrl);
  console.error('Retry count:', retryCount);
  console.error('Error event:', e);
  console.error('Navigator online:', navigator.onLine);
  console.groupEnd();
  
  // Try retry with cache-busting if we haven't retried too many times
  if (retryCount < 2) {
    console.log(`🔄 Retrying image load for ${group.name} (attempt ${retryCount + 1}/2) with cache-busting...`);
    const img = e.target as HTMLImageElement;
    const cacheBustUrl = usedUrl + (usedUrl.includes('?') ? '&' : '?') + `t=${Date.now()}&retry=${retryCount + 1}`;
    img.src = cacheBustUrl;
    setImageRetryCount(prev => ({...prev, [group._id]: retryCount + 1}));
    return;
  }
  
  // After max retries, check if image actually loaded
  setTimeout(() => {
    console.log(`🔄 Final check if image loaded after error for ${group.name}...`);
    const img = e.target as HTMLImageElement;
    if (img.complete && img.naturalWidth === 0) {
      console.log('❌ Image permanently failed, hiding container');
      img.parentElement!.style.display = 'none';
    } else if (img.complete && img.naturalWidth > 0) {
      console.log('✅ Image actually loaded successfully after error!');
    }
  }, 1000);
};