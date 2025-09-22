'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { About, aboutService } from '@/services/about.service';

interface Trainer {
  _id: string;
  name: string;
  position: string;
  image?: string;
  qualification?: string;
}

export default function TrainerStaffPage(): React.ReactElement {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async (): Promise<void> => {
      try {
        const data = await aboutService.getAbout();
        setAbout(data);
        setError(null);
      } catch (err) {
        setError('Eğitmen kadro bilgileri yüklenirken bir hata oluştu');
        console.error('Error fetching about:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !about) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Eğitmen kadro bilgileri bulunamadı'}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-black">
        <div className="relative h-[300px]">
          <Image
            src="/team.jpg"
            alt="Eğitmen Kadromuz"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 container mx-auto">
            <div className="h-full flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Eğitmen Kadromuz</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                UEFA lisanslı profesyonel antrenörlerimiz ve deneyimli eğitmen kadromuzla geleceğin yıldızlarını yetiştiriyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trainers Section */}
      <section className="py-16 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {about.trainers.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Profesyonel Eğitmen Kadromuz</h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Deneyimli ve UEFA lisanslı antrenörlerimizle, her yaş grubuna uygun profesyonel futbol eğitimi sunuyoruz. 
                    Eğitmen kadromuz, sporcularımızın teknik ve taktik gelişimlerini desteklemek için sürekli kendilerini geliştirmektedir.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {about.trainers.map((trainer) => (
                    <div key={trainer._id} className="group">
                      <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                        <div className="w-40 h-40 mx-auto mb-6 relative rounded-full overflow-hidden ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-300">
                          <Image
                            src={trainer.image || '/trainer-placeholder.jpg'}
                            alt={trainer.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{trainer.name}</h3>
                        <p className="text-blue-600 font-semibold mb-2">{trainer.position}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{trainer.qualification}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Eğitmen Kadrosu Güncelleniyor</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Eğitmen kadromuz şu anda güncellenmektedir. En kısa sürede profesyonel antrenörlerimizin bilgilerini paylaşacağız.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bizimle Futbol Yolculuğunuza Başlayın</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Profesyonel eğitmen kadromuz ve modern tesislerimizle futbol hayallerinizi gerçeğe dönüştürün.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/groups"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gruplarımızı İnceleyin
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              İletişime Geçin
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}