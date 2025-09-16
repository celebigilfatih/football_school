import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clubService } from '@/services/club.service';

export default function Footer() {
  const [clubInfo, setClubInfo] = useState({
    name: 'Football School',
    address: 'Örnek Mahallesi, Spor Caddesi No:123 Kadıköy/İstanbul',
    phone: '+90 (216) 123 45 67',
    email: 'info@footballschool.com',
    socialMedia: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      whatsapp: 'https://wa.me/1234567890',
      twitter: '',
      youtube: ''
    }
  });

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        // Önbelleği devre dışı bırakmak için her seferinde yeni bir istek yap
        const clubData = await clubService.getClubInfo();
        
        if (clubData) {
          setClubInfo({
            name: clubData.name || 'Football School',
            address: clubData.address || 'Örnek Mahallesi, Spor Caddesi No:123 Kadıköy/İstanbul',
            phone: clubData.phone || '+90 (216) 123 45 67',
            email: clubData.email || 'info@footballschool.com',
            socialMedia: {
              instagram: clubData.socialMedia?.instagram || 'https://instagram.com',
              facebook: clubData.socialMedia?.facebook || 'https://facebook.com',
              whatsapp: clubData.socialMedia?.whatsapp || 'https://wa.me/1234567890',
              twitter: clubData.socialMedia?.twitter || '',
              youtube: clubData.socialMedia?.youtube || ''
            }
          });
        }
      } catch (error) {
        console.error('Error fetching club info:', error);
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
    <footer className="football-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Football School */}
          <div className="md:col-span-6">
            <div className="text-2xl font-bold w-48">{clubInfo.name}</div>
            <p className="mt-4 text-gray-300 text-sm">
              Geleceğin yıldızlarını yetiştiriyoruz. Profesyonel eğitim kadromuz ve modern tesislerimizle futbolun her alanında mükemmelliği hedefliyoruz.
            </p>
            <div className="mt-6 w-full h-48 rounded-lg overflow-hidden">
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

          {/* Menu Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Menü</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white text-sm">Hakkımızda</Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-white text-sm">A Takım</Link>
              </li>
              <li>
                <Link href="/groups" className="text-gray-300 hover:text-white text-sm">Alt Yapı Takımlarımız</Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white text-sm">Haberler</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm">İletişim</Link>
              </li>
            </ul>
          </div>

          {/* Teams */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Takımlar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/groups#u9" className="text-gray-300 hover:text-white text-sm">U9</Link>
              </li>
              <li>
                <Link href="/groups#u11" className="text-gray-300 hover:text-white text-sm">U11</Link>
              </li>
              <li>
                <Link href="/groups#u13" className="text-gray-300 hover:text-white text-sm">U13</Link>
              </li>
              <li>
                <Link href="/groups#u15" className="text-gray-300 hover:text-white text-sm">U15</Link>
              </li>
              <li>
                <Link href="/groups#u17" className="text-gray-300 hover:text-white text-sm">U17</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Adres: {clubInfo.address}
              </p>
              <p className="text-gray-300 text-sm">
                Telefon: {clubInfo.phone}
              </p>
              <p className="text-gray-300 text-sm">
                E-posta: {clubInfo.email}
              </p>
              <div className="flex space-x-4">
                {clubInfo.socialMedia.instagram && (
                  <a 
                    href={clubInfo.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {clubInfo.socialMedia.facebook && (
                  <a 
                    href={clubInfo.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {clubInfo.socialMedia.whatsapp && (
                  <a 
                    href={clubInfo.socialMedia.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="mt-16 pt-8 border-t border-blue-800 flex flex-wrap justify-between items-center">
          <div className="text-sm text-gray-300">
            © {new Date().getFullYear()} {clubInfo.name}. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <Link href="/kvkk" className="hover:text-white">K.V.K.K.</Link>
            <Link href="/privacy" className="hover:text-white">Gizlilik Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 