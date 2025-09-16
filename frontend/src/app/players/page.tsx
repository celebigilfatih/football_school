'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Player } from '@/services/player.service';
import { TechnicalStaff } from '@/services/technicalStaff.service';
import { getAllPlayers } from '@/services/player.service';
import { getAllStaff } from '@/services/technicalStaff.service';
import { toast } from 'react-hot-toast';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [staff, setStaff] = useState<TechnicalStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersData, staffData] = await Promise.all([
        getAllPlayers(),
        getAllStaff()
      ]);
      setPlayers(playersData);
      setStaff(staffData);
    } catch (error) {
      toast.error('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Kaleci':
        return 'bg-yellow-100 text-yellow-800';
      case 'Defans':
        return 'bg-blue-100 text-blue-800';
      case 'Orta Saha':
        return 'bg-green-100 text-green-800';
      case 'Forvet':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStaffPositionColor = (position: string) => {
    switch (position) {
      case 'Teknik Direktör':
        return 'bg-purple-100 text-purple-800';
      case 'Yardımcı Antrenör':
        return 'bg-indigo-100 text-indigo-800';
      case 'Kaleci Antrenörü':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-black">
        <div className="relative h-[250px]">
          <Image
            src="/match.jpg"
            alt="Football Players"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 container mx-auto">
            <div className="h-full flex flex-col justify-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">A Takım Oyuncuları</h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Takımımızın profesyonel futbolcuları
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Futbolcular</h2>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center text-gray-500">
              Henüz oyuncu bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players.map((player) => (
                <div
                  key={player._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-80">
                    <Image
                      src={player.image || '/player-placeholder.jpg'}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{player.name}</h2>
                      <span className="text-2xl font-bold text-primary">#{player.number}</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(player.position)}`}>
                      {player.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Technical Staff Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Teknik Ekip</h2>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center text-gray-500">
              Henüz teknik ekip üyesi bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {staff.map((member) => (
                <div
                  key={member._id}
                  className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-80">
                    <Image
                      src={member.image || '/staff-placeholder.jpg'}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStaffPositionColor(member.position)}`}>
                      {member.position}
                    </span>
                    <p className="mt-2 text-sm text-gray-600">{member.qualification}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 