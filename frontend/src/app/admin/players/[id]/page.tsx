'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Player } from '@/services/player.service';
import { getPlayerById, updatePlayer } from '@/services/player.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

interface PlayerFormData extends Omit<Player, '_id'> {}

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('/player-placeholder.jpg');
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    position: 'Kaleci',
    number: 0,
    birthDate: '',
    nationality: 'TR',
    height: 170,
    weight: 70,
    image: '/player-placeholder.jpg',
    stats: {
      matches: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    },
    isActive: true,
    joinDate: new Date().toISOString()
  });

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const player = await getPlayerById(params.id);
        setFormData({
          ...player,
          birthDate: new Date(player.birthDate).toISOString().split('T')[0]
        });
        setImagePreview(player.image);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching player:', error);
        toast.error('Oyuncu bilgileri yüklenirken bir hata oluştu');
        router.push('/admin/players');
      }
    };

    fetchPlayer();
  }, [params.id]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, image: base64 }));
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        toast.error('Fotoğraf yüklenirken bir hata oluştu');
        console.error('Error uploading image:', error);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Form validation
      if (!formData.name.trim()) {
        toast.error('İsim alanı zorunludur');
        return;
      }

      if (!formData.position) {
        toast.error('Pozisyon seçimi zorunludur');
        return;
      }

      if (!formData.number || formData.number < 1 || formData.number > 99) {
        toast.error('Geçerli bir forma numarası giriniz (1-99)');
        return;
      }

      if (!formData.birthDate) {
        toast.error('Doğum tarihi zorunludur');
        return;
      }

      // Prepare data for submission
      const playerData = {
        ...formData,
        name: formData.name.trim(),
        number: parseInt(String(formData.number))
      };

      console.log('Submitting player data:', playerData);

      await updatePlayer(params.id, playerData);
      toast.success('Oyuncu başarıyla güncellendi');
      router.push('/admin/players');
    } catch (error: any) {
      console.error('Form submission error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Oyuncu güncellenirken bir hata oluştu';
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Oyuncu Düzenle</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">İsim</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Pozisyon</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => handleChange('position', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pozisyon seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kaleci">Kaleci</SelectItem>
                <SelectItem value="Defans">Defans</SelectItem>
                <SelectItem value="Orta Saha">Orta Saha</SelectItem>
                <SelectItem value="Forvet">Forvet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Forma Numarası</Label>
            <Input
              id="number"
              type="number"
              min="1"
              max="99"
              value={formData.number || ''}
              onChange={(e) => handleChange('number', e.target.value ? parseInt(e.target.value) : '')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Doğum Tarihi</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate.split('T')[0]}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              required
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="image">Fotoğraf</Label>
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={imagePreview}
                  alt="Player preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG, GIF dosyaları (max. 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  );
} 