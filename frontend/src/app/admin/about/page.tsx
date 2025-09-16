'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { About, aboutService } from '@/services/about.service';
import { authService } from '@/services/auth.service';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminAbout() {
  const router = useRouter();
  const [about, setAbout] = useState<About>({
    title: '',
    content: '',
    trainers: [],
    heroImage: '',
    updatedAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    position: '',
    image: '',
    qualification: ''
  });

  useEffect(() => {
    // Check authentication
    const admin = authService.getStoredAdmin();
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    // Initialize auth headers
    authService.initializeAuth();
    
    fetchAbout();
  }, [router]);

  const fetchAbout = async () => {
    try {
      const data = await aboutService.getAbout();
      setAbout(data);
      setError(null);
    } catch (err) {
      setError('Hakkımızda bilgileri yüklenirken bir hata oluştu');
      console.error('Error fetching about:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: 'title' | 'content', value: string) => {
    setAbout(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTrainerChange = (index: number, field: keyof About['trainers'][0], value: string) => {
    setAbout(prev => ({
      ...prev,
      trainers: prev.trainers.map((trainer, i) =>
        i === index ? { ...trainer, [field]: value } : trainer
      )
    }));
  };

  const handleNewTrainerChange = (field: keyof typeof newTrainer, value: string) => {
    setNewTrainer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await aboutService.updateAbout({
        title: about.title,
        content: about.content
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Değişiklikler kaydedilirken bir hata oluştu');
      console.error('Error saving about:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTrainer = async () => {
    if (!newTrainer.name || !newTrainer.position || !newTrainer.qualification) {
      setError('Lütfen tüm eğitmen bilgilerini doldurun');
      return;
    }

    setSaving(true);
    try {
      const updatedAbout = await aboutService.addTrainer(newTrainer);
      setAbout(updatedAbout);
      setNewTrainer({
        name: '',
        position: '',
        image: '',
        qualification: ''
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Eğitmen eklenirken bir hata oluştu');
      console.error('Error adding trainer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrainer = async (trainerId: string) => {
    if (!window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      return;
    }

    setSaving(true);
    try {
      await aboutService.deleteTrainer(trainerId);
      setAbout(prev => ({
        ...prev,
        trainers: prev.trainers.filter(t => t._id !== trainerId)
      }));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Eğitmen silinirken bir hata oluştu');
      console.error('Error deleting trainer:', err);
    } finally {
      setSaving(false);
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hakkımızda Sayfası Yönetimi</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <Input
                value={about.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Hakkımızda başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <Textarea
                value={about.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Hakkımızda içeriği"
                rows={6}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Eğitmen Kadrosu</h2>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            {about.trainers.map((trainer, index) => (
              <div key={trainer._id} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <Input
                      value={trainer.name}
                      onChange={(e) => handleTrainerChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozisyon
                    </label>
                    <Input
                      value={trainer.position}
                      onChange={(e) => handleTrainerChange(index, 'position', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fotoğraf URL
                    </label>
                    <Input
                      value={trainer.image}
                      onChange={(e) => handleTrainerChange(index, 'image', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yeterlilik
                    </label>
                    <Input
                      value={trainer.qualification}
                      onChange={(e) => handleTrainerChange(index, 'qualification', e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => trainer._id && handleDeleteTrainer(trainer._id)}
                  className="mt-4"
                  disabled={saving}
                >
                  Eğitmeni Sil
                </Button>
              </div>
            ))}

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Yeni Eğitmen Ekle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <Input
                    value={newTrainer.name}
                    onChange={(e) => handleNewTrainerChange('name', e.target.value)}
                    placeholder="Eğitmenin adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pozisyon
                  </label>
                  <Input
                    value={newTrainer.position}
                    onChange={(e) => handleNewTrainerChange('position', e.target.value)}
                    placeholder="Eğitmenin pozisyonu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fotoğraf URL
                  </label>
                  <Input
                    value={newTrainer.image}
                    onChange={(e) => handleNewTrainerChange('image', e.target.value)}
                    placeholder="Fotoğraf bağlantısı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yeterlilik
                  </label>
                  <Input
                    value={newTrainer.qualification}
                    onChange={(e) => handleNewTrainerChange('qualification', e.target.value)}
                    placeholder="Eğitmenin yeterliliği"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddTrainer}
                className="mt-4"
                disabled={saving}
              >
                Eğitmen Ekle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 