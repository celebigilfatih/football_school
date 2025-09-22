'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { About, aboutService } from '@/services/about.service';

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await aboutService.getAbout();
        setAbout(data);
        setError(null);
      } catch (err) {
        setError('Sayfa yüklenirken bir hata oluştu');
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
            {error || 'Sayfa bulunamadı'}
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
        <div className="relative h-[250px]">
          <Image
            src="/match.jpg"
            alt="Football Training"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 container mx-auto">
            <div className="h-full flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{about.title}</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Geleceğin yıldızlarını yetiştiriyoruz. Profesyonel eğitim kadromuz ve modern tesislerimizle, genç yetenekleri keşfedip geliştiriyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="container mx-auto">
          <div className="w-full">
            <div className="prose max-w-none">
              {about.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Neden Biz?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Profesyonel Eğitim</h3>
              <p className="text-gray-600">UEFA lisanslı antrenörlerimizle profesyonel futbol eğitimi sunuyoruz.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Modern Tesisler</h3>
              <p className="text-gray-600">Son teknoloji ekipmanlar ve modern tesislerle kaliteli bir eğitim ortamı sağlıyoruz.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Bireysel Gelişim</h3>
              <p className="text-gray-600">Her öğrencimizin bireysel gelişimini takip ediyor ve destekliyoruz.</p>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}