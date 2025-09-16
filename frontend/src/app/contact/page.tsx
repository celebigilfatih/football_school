'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { clubService, Club } from '@/services/club.service';

export default function Contact() {
  const [clubInfo, setClubInfo] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        // Önbelleği devre dışı bırakmak için her seferinde yeni bir istek yap
        const data = await clubService.getClubInfo();
        setClubInfo(data);
      } catch (error) {
        console.error('Error fetching club info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubInfo();
    
    // Sayfa görünür olduğunda veriyi yeniden yükle
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchClubInfo();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/match.jpg"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
        </div>
        <div className="relative container mx-auto h-full flex flex-col justify-center px-4">
          <h1 className="text-5xl font-bold text-white mb-4">İletişim</h1>
          <p className="text-xl text-gray-200 max-w-2xl">Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk duyarız.</p>
        </div>
      </section>

      <section className="flex-1 py-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Adres</h3>
                        <p className="text-gray-600">{clubInfo?.address || 'Yükleniyor...'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Telefon</h3>
                        <p className="text-gray-600">{clubInfo?.phone || 'Yükleniyor...'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">E-posta</h3>
                        <p className="text-gray-600">{clubInfo?.email || 'Yükleniyor...'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
                        <p className="text-gray-600">
                          Hafta içi: 09:00 - 21:00<br />
                          Hafta sonu: 10:00 - 20:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Konum</h2>
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6504900120997!2d29.0307!3d40.9907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU5JzI2LjUiTiAyOcKwMDEnNTAuNiJF!5e0!3m2!1str!2str!4v1640000000000!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 