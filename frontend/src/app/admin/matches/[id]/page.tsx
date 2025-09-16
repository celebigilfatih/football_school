'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { format } from 'date-fns';
import { Match, matchService } from '@/services/match.service';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MatchFormData = {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  score: {
    homeTeam: number;
    awayTeam: number;
  };
};

export default function AdminMatchForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<MatchFormData>({
    homeTeam: '',
    awayTeam: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    status: 'scheduled',
    score: {
      homeTeam: 0,
      awayTeam: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id !== 'new') {
      fetchMatch();
    }
  }, [id]);

  const fetchMatch = async () => {
    try {
      const match = await matchService.getById(id);
      setFormData({
        ...match,
        date: new Date(match.date).toISOString().split('T')[0],
        score: match.score || { homeTeam: 0, awayTeam: 0 }
      });
      setError(null);
    } catch (err: any) {
      console.error('Error fetching match:', err);
      setError(err.response?.data?.message || 'Maç yüklenirken bir hata oluştu');
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        date: new Date(formData.date)
      };

      if (id === 'new') {
        await matchService.create(submitData);
      } else {
        await matchService.update(id, submitData);
      }

      router.push('/admin/matches');
    } catch (err: any) {
      console.error('Error saving match:', err);
      setError(err.response?.data?.message || 'Maç kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Yeni Maç' : 'Maç Düzenle'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="homeTeam">Ev Sahibi Takım</Label>
            <Input
              id="homeTeam"
              value={formData.homeTeam}
              onChange={(e) => handleChange('homeTeam', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="awayTeam">Deplasman Takımı</Label>
            <Input
              id="awayTeam"
              value={formData.awayTeam}
              onChange={(e) => handleChange('awayTeam', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="date">Tarih</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Saat</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Saha</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Durum</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value as 'scheduled' | 'completed' | 'cancelled')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Planlandı</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.status === 'completed' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="homeScore">Ev Sahibi Skoru</Label>
              <Input
                id="homeScore"
                type="number"
                min="0"
                value={formData.score.homeTeam}
                onChange={(e) => handleChange('score', { ...formData.score, homeTeam: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="awayScore">Deplasman Skoru</Label>
              <Input
                id="awayScore"
                type="number"
                min="0"
                value={formData.score.awayTeam}
                onChange={(e) => handleChange('score', { ...formData.score, awayTeam: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Kaydet'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/matches')}>
            İptal
          </Button>
        </div>
      </form>
    </div>
  );
} 