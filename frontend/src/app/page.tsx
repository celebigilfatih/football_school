'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Announcement, announcementService } from "@/services/announcement.service";
import { News, newsService } from '@/services/news.service';
import { Match, matchService } from '@/services/match.service';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Player, getAllPlayers } from '@/services/player.service';

const slides = [
  {
    id: 1,
    image: "/slider1.jpg",
    title: "Zirveye Hükmet",
    subtitle: "2024/25 Futbol Okulu Kayıtları Başladı",
    buttonText: "Hemen Başvur",
    buttonLink: "/contact"
  },
  {
    id: 2,
    image: "/slider2.jpg",
    title: "Geleceğin Yıldızları",
    subtitle: "Profesyonel Eğitmenlerle Futbol Eğitimi",
    buttonText: "Detaylı Bilgi",
    buttonLink: "/about"
  },
  {
    id: 3,
    image: "/slider3.jpg",
    title: "Başarıya Giden Yol",
    subtitle: "Modern Tesisler ve Ekipmanlar",
    buttonText: "Alt Yapı Takımlarımız",
    buttonLink: "/groups"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAll();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAnnouncements();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getAll();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNews();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        const matches = await matchService.getUpcoming();
        setUpcomingMatches(matches);
        setMatchError(null);
      } catch (err) {
        setMatchError('Maç bilgileri yüklenirken bir hata oluştu');
        console.error('Error fetching matches:', err);
      } finally {
        setMatchLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setPlayersLoading(true);
        const data = await getAllPlayers();
        setPlayers(data);
        setPlayersError(null);
      } catch (error) {
        console.error('Error fetching players:', error);
        setPlayersError('Oyuncular yüklenirken bir hata oluştu');
      } finally {
        setPlayersLoading(false);
      }
    };

    fetchPlayers();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPlayers();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="flex flex-col">
      <Header />

      {/* Hero Section with Slider */}
      <section className="relative h-[600px] md:h-[600px] container mt-2">
        <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-7 gap-2">
          {/* Ana Slider - Sol taraf */}
          <div className="col-span-1 md:col-span-5 relative overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={`slide-main-${slide.id || index}`}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 md:px-12">
                    <div className="text-white max-w-xl">
                      <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-white">{slide.title}</h1>
                      <p className="text-lg md:text-xl mb-4 md:mb-6">{slide.subtitle}</p>
                      <Link 
                        href={slide.buttonLink}
                        className="inline-flex items-center bg-white text-blue-600 px-4 py-2 md:px-8 md:py-3 text-base md:text-lg font-bold rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                      >
                        {slide.buttonText}
                        <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Sol slider navigation */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent">
              <div className="container mx-auto px-6 md:px-12 py-4 md:py-6">
                <div className="flex items-center gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={`slide-nav-${index}`}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all focus:outline-none ${
                        index === currentSlide ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={goToPrevSlide}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Sağ taraf - Üç bölüm - Mobilde gizle */}
          <div className="hidden md:grid col-span-2 grid-rows-3 gap-0">
            {/* Üst bölüm */}
            <div className="relative overflow-hidden">
              <Image
                src="/team.jpg"
                alt="Alt Yapı Takımlarımız"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute inset-0 flex items-end">
                <div className="p-8">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2 text-white">Alt Yapı Takımlarımız</h2>
                    <p className="text-sm mb-4">Yaş gruplarına göre takımlarımız</p>
                    <Link 
                      href="/teams"
                      className="inline-flex items-center text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Detaylı Bilgi
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Orta bölüm */}
            <div className="relative overflow-hidden">
              <Image
                src="/antreman_program.jpg"
                alt="Antrenman Programı"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute inset-0 flex items-end">
                <div className="p-8">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2 text-white">Antrenman Programı</h2>
                    <p className="text-sm mb-4">Haftalık antrenman programı ve saatlerimiz</p>
                    <Link 
                      href="/schedule"
                      className="inline-flex items-center text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Detaylı Bilgi
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt bölüm - Duyurular */}
            <div className="relative overflow-hidden">
            <Image
                src="/saha.jpg"
                alt="Futbol Sahası"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="relative p-6">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-3 text-white">Duyurular</h2>
                  <div className="space-y-1.5">
                    {loading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-white/20 rounded"></div>
                        <div className="h-4 bg-white/20 rounded"></div>
                      </div>
                    ) : announcements.length === 0 ? (
                      <div className="text-sm text-white/70">Henüz duyuru bulunmuyor.</div>
                    ) : (
                      announcements
                        .filter(announcement => announcement !== null && announcement !== undefined)
                        .slice(0, 2)
                        .map((announcement) => (
                          <Link
                            key={announcement?._id || Math.random().toString()}
                            href={`/announcements/${announcement?._id}`}
                            className="text-sm block p-1 hover:bg-white/10 transition rounded-lg"
                          >
                            {announcement?.priority === 'Acil' && (
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            )}
                            <span className="line-clamp-1">{announcement?.title || 'Duyuru'}</span>
                          </Link>
                        ))
                    )}
                    <Link 
                      href="/announcements"
                      className="inline-flex items-center text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Tüm Duyurular
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Yaklaşan Maçlar</h2>
          
          {matchLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : matchError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 max-w-lg mx-auto">
              {matchError}
            </div>
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <div
                  key={match._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-gray-500">
                        {format(new Date(match.date), 'd MMMM yyyy', { locale: tr })}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {match.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold text-gray-900">{match.homeTeam}</div>
                      <div className="text-sm font-bold text-gray-400">VS</div>
                      <div className="text-lg font-semibold text-gray-900">{match.awayTeam}</div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {match.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center max-w-lg mx-auto">
              <p className="text-gray-600">Şu anda planlanmış maç bulunmuyor.</p>
              <p className="text-gray-500 mt-2">Yakında yeni maçlar eklenecektir.</p>
            </div>
          )}
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          {/* Son Haberler */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-200"></div>
              <h2 className="text-4xl font-bold text-gray-800">Son Haberler</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {news.length > 0 ? 
              news
                .filter(item => item !== null && item !== undefined)
                .slice(0, 4)
                .map((item) => (
                  <article key={item?._id || Math.random().toString()} className="bg-white shadow-sm overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={item?.image || '/news-placeholder.jpg'}
                        alt={item?.title || 'News'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {item?.category || 'Genel'}
                        </span>
                        <time className="text-sm text-gray-500">
                          {item?.publishDate ? new Date(item.publishDate).toLocaleDateString('tr-TR') : ''}
                        </time>
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{item?.title || 'Haber'}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {item?.content || ''}
                      </p>
                      <Link 
                        href={`/news/${item?._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                      >
                        Devamını Oku
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))
              :
              <div className="col-span-full text-center text-gray-500">
                Henüz haber bulunmuyor.
              </div>
            }
          </div>
        </div>
      </section>

      {/* Latest Announcements Section */}
      <section className="relative py-16">
        <div className="absolute inset-0">
          <Image
            src="/match.jpg"
            alt="Announcements Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="relative container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Son Duyurular</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {announcements.length > 0 ? 
              announcements
                .filter(announcement => announcement !== null && announcement !== undefined)
                .slice(0, 3)
                .map((announcement) => (
                  <Link 
                    key={announcement?._id || Math.random().toString()} 
                    href={`/announcements/${announcement?._id}`} 
                    className="block hover:opacity-90 transition-opacity"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs text-white rounded-full ${
                            announcement?.priority === 'Acil' ? 'bg-red-500' :
                            announcement?.priority === 'Yüksek' ? 'bg-orange-500' :
                            announcement?.priority === 'Normal' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}>
                            {announcement?.priority || 'Normal'}
                          </span>
                          <time className="text-sm text-gray-300">
                            {announcement?.startDate ? new Date(announcement.startDate).toLocaleDateString('tr-TR') : ''}
                          </time>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-white">{announcement?.title || 'Duyuru'}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                          {announcement?.content || ''}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {announcement?.targetGroups && announcement.targetGroups
                            .filter(group => group !== null && group !== undefined)
                            .map((group) => (
                              <span 
                                key={typeof group === 'string' ? group : (group?._id || Math.random().toString())} 
                                className="px-2 py-1 text-xs bg-white/20 text-white rounded"
                              >
                                {typeof group === 'string' ? group : (group?.name || 'Grup')}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              : 
              <div className="col-span-full text-center text-white">
                Henüz duyuru bulunmuyor.
              </div>
            }
          </div>
          
          <div className="text-center">
            <Link
              href="/announcements"
              className="inline-flex items-center text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors text-white"
            >
              Tüm Duyurular
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* A Takım Oyuncuları */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">A Takım Oyuncuları</h2>
          
          {playersLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : playersError ? (
            <div className="text-center text-red-500">{playersError}</div>
          ) : players.length === 0 ? (
            <div className="text-center text-gray-500">Henüz oyuncu bulunmuyor.</div>
          ) : (
            <div className="relative w-full overflow-hidden">
              <div className="flex space-x-6 animate-marquee">
                {players.length > 0 && 
                  players.filter(player => player !== null && player !== undefined)
                    .map((player, index) => (
                      <div
                        key={`original-player-index-${index}`}
                        className="flex-none w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                      >
                        <div className="relative h-64 w-full">
                          <Image
                            src={player?.image || '/images/default-player.png'}
                            alt={player?.name || 'Player'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800">{player?.name || 'Unknown Player'}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">{player?.position || 'Unknown'}</span>
                            <span className="text-sm font-bold text-primary">#{player?.number || '0'}</span>
                          </div>
                        </div>
                      </div>
                    ))
                }
                {players.length > 0 && 
                  players.filter(player => player !== null && player !== undefined)
                    .map((player, index) => (
                      <div
                        key={`duplicate-player-index-${index + players.length}`}
                        className="flex-none w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                      >
                        <div className="relative h-64 w-full">
                          <Image
                            src={player?.image || '/images/default-player.png'}
                            alt={player?.name || 'Player'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800">{player?.name || 'Unknown Player'}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">{player?.position || 'Unknown'}</span>
                            <span className="text-sm font-bold text-primary">#{player?.number || '0'}</span>
                          </div>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              href="/players"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Tüm Oyuncuları Gör
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
