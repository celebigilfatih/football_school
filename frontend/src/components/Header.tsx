import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { clubService } from '@/services/club.service';

export default function Header() {
  const [clubInfo, setClubInfo] = useState({
    name: 'Football School',
    logo: '/logo.png',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      whatsapp: '',
      youtube: ''
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        // Önbelleği devre dışı bırakmak için her seferinde yeni bir istek yap
        const data = await clubService.getClubInfo();
        
        // Veri geldiğinde state'i güncelle
        if (data) {
          setClubInfo({
            name: data.name || 'Football School',
            logo: data.logo || '/logo.png',
            socialMedia: {
              facebook: '',
              instagram: '',
              twitter: '',
              whatsapp: '',
              youtube: ''
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="football-gradient text-white">
      <nav className="container mx-auto py-6">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white/10">
              <Image 
                src={clubInfo.logo.startsWith('http') ? clubInfo.logo : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${clubInfo.logo}`} 
                alt={clubInfo.name} 
                width={40} 
                height={40} 
                className="object-contain"
                priority
                unoptimized={true}
              />
            </div>
            <div className="text-2xl font-bold">{clubInfo.name}</div>
          </div>
          <div className="hidden md:flex space-x-6 justify-end">
            <Link href="/" className="hover:text-blue-300 font-semibold text-sm tracking-wide">ANA SAYFA</Link>
            <Link href="/about" className="hover:text-blue-300 font-semibold text-sm tracking-wide">HAKKIMIZDA</Link>
            <Link href="/players" className="hover:text-blue-300 font-semibold text-sm tracking-wide">A TAKIM</Link>
            <Link href="/groups" className="hover:text-blue-300 font-semibold text-sm tracking-wide">ALT YAPI TAKIMLARIMIZ</Link>
            <Link href="/news" className="hover:text-blue-300 font-semibold text-sm tracking-wide">HABERLER</Link>
            <Link href="/announcements" className="hover:text-blue-300 font-semibold text-sm tracking-wide">DUYURULAR</Link>
            <Link href="/contact" className="hover:text-blue-300 font-semibold text-sm tracking-wide">İLETİŞİM</Link>
          </div>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-50" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-6 py-8">
              <Link 
                href="/" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                ANA SAYFA
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                HAKKIMIZDA
              </Link>
              <Link 
                href="/players" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                A TAKIM
              </Link>
              <Link 
                href="/groups" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                ALT YAPI TAKIMLARIMIZ
              </Link>
              <Link 
                href="/news" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                HABERLER
              </Link>
              <Link 
                href="/announcements" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                DUYURULAR
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-blue-300 font-semibold text-lg tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                İLETİŞİM
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 