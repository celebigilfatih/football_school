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
  const [newTrainerImageFile, setNewTrainerImageFile] = useState<File | null>(null);
  const [newTrainerImagePreview, setNewTrainerImagePreview] = useState<string>('');
  const [editingTrainerImages, setEditingTrainerImages] = useState<{[key: string]: {file: File | null, preview: string}}>({});

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

  const handleNewTrainerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewTrainerImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTrainerImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      let trainerData = { ...newTrainer };
      
      // Eğer dosya yüklendiyse, FormData kullanarak gönder
      if (newTrainerImageFile) {
        const formData = new FormData();
        formData.append('name', newTrainer.name);
        formData.append('position', newTrainer.position);
        formData.append('qualification', newTrainer.qualification);
        formData.append('image', newTrainerImageFile);
        
        const updatedAbout = await aboutService.addTrainerWithImage(formData);
        setAbout(updatedAbout);
      } else {
        // Dosya yoksa normal şekilde gönder
        const updatedAbout = await aboutService.addTrainer(trainerData);
        setAbout(updatedAbout);
      }
      
      setNewTrainer({
        name: '',
        position: '',
        image: '',
        qualification: ''
      });
      setNewTrainerImageFile(null);
      setNewTrainerImagePreview('');
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

  const handleTrainerImageChange = (trainerId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingTrainerImages(prev => ({
          ...prev,
          [trainerId]: {
            file: file,
            preview: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTrainer = async (trainerId: string, trainerData: any) => {
    setSaving(true);
    try {
      const imageData = editingTrainerImages[trainerId];
      
      if (imageData?.file) {
        // Dosya yükleme ile güncelle
        const formData = new FormData();
        formData.append('name', trainerData.name);
        formData.append('position', trainerData.position);
        formData.append('qualification', trainerData.qualification);
        formData.append('image', imageData.file);
        
        const updatedAbout = await aboutService.updateTrainerWithImage(trainerId, formData);
        setAbout(updatedAbout);
        
        // Düzenleme state'ini temizle
        setEditingTrainerImages(prev => {
          const newState = { ...prev };
          delete newState[trainerId];
          return newState;
        });
      } else {
        // Normal güncelleme
        const updatedAbout = await aboutService.updateTrainer(trainerId, trainerData);
        setAbout(updatedAbout);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Eğitmen güncellenirken bir hata oluştu');
      console.error('Error updating trainer:', err);
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
                      Fotoğraf
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => trainer._id && handleTrainerImageChange(trainer._id, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {(editingTrainerImages[trainer._id || '']?.preview || trainer.image) && (
                        <div className="mt-2">
                          <img
                            src={editingTrainerImages[trainer._id || '']?.preview || trainer.image}
                            alt="Eğitmen fotoğrafı"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        JPG, PNG veya GIF formatında, maksimum 5MB
                      </p>
                    </div>
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
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => trainer._id && handleUpdateTrainer(trainer._id, trainer)}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Güncelle
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => trainer._id && handleDeleteTrainer(trainer._id)}
                    disabled={saving}
                  >
                    Eğitmeni Sil
                  </Button>
                </div>
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
                    Fotoğraf
                  </label>
                  <div className="space-y-2">
                    {newTrainerImagePreview && (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          src={newTrainerImagePreview}
                          alt="Önizleme"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleNewTrainerImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF dosyaları (max. 5MB)
                    </p>
                  </div>
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