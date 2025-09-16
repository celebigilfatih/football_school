'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Player } from '@/services/player.service';
import { getAllPlayers, deletePlayer } from '@/services/player.service';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const data = await getAllPlayers();
      setPlayers(data);
    } catch (error) {
      toast.error('Oyuncular yüklenirken bir hata oluştu');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/players/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu oyuncuyu silmek istediğinizden emin misiniz?')) {
      try {
        await deletePlayer(id);
        toast.success('Oyuncu başarıyla silindi');
        fetchPlayers();
      } catch (error) {
        toast.error('Oyuncu silinirken bir hata oluştu');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">A Takım Oyuncuları</h1>
        <Button onClick={() => router.push('/admin/players/new')}>
          Yeni Oyuncu Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4">
              <img
                src={player.image}
                alt={player.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{player.name}</h2>
                <p className="text-gray-600">{player.position}</p>
                <p className="text-gray-600">#{player.number}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(player._id)}
              >
                Düzenle
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(player._id)}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 