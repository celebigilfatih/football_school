'use client';

import { useState, useEffect } from 'react';
import { aboutService, About } from '@/services/about.service';
import { toast } from 'react-hot-toast';

interface Trainer {
  _id?: string;
  name: string;
  position: string;
  image: string;
  qualification: string;
}

export default function AdminEgitmenKadroPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    qualification: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const aboutData = await aboutService.getAbout();
      setTrainers(aboutData.trainers || []);
    } catch (error) {
      console.error('Eğitmenler yüklenirken hata:', error);
      toast.error('Eğitmenler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.qualification) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      if (editingTrainer) {
        // Güncelleme
        if (imageFile) {
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('position', formData.position);
          formDataToSend.append('qualification', formData.qualification);
          formDataToSend.append('image', imageFile);
          
          await aboutService.updateTrainerWithImage(editingTrainer._id!, formDataToSend);
        } else {
          await aboutService.updateTrainer(editingTrainer._id!, {
            name: formData.name,
            position: formData.position,
            qualification: formData.qualification,
            image: formData.image
          });
        }
        toast.success('Eğitmen başarıyla güncellendi');
      } else {
        // Yeni ekleme
        if (imageFile) {
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('position', formData.position);
          formDataToSend.append('qualification', formData.qualification);
          formDataToSend.append('image', imageFile);
          
          await aboutService.addTrainerWithImage(formDataToSend);
        } else {
          await aboutService.addTrainer({
            name: formData.name,
            position: formData.position,
            qualification: formData.qualification,
            image: formData.image || '/images/default-trainer.jpg'
          });
        }
        toast.success('Eğitmen başarıyla eklendi');
      }

      // Formu temizle ve listeyi yenile
      setFormData({ name: '', position: '', qualification: '', image: '' });
      setImageFile(null);
      setShowAddForm(false);
      setEditingTrainer(null);
      fetchTrainers();
    } catch (error) {
      console.error('Eğitmen kaydedilirken hata:', error);
      toast.error('Eğitmen kaydedilirken hata oluştu');
    }
  };

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      position: trainer.position,
      qualification: trainer.qualification,
      image: trainer.image
    });
    setShowAddForm(true);
  };

  const handleDelete = async (trainerId: string) => {
    if (!confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await aboutService.deleteTrainer(trainerId);
      toast.success('Eğitmen başarıyla silindi');
      fetchTrainers();
    } catch (error) {
      console.error('Eğitmen silinirken hata:', error);
      toast.error('Eğitmen silinirken hata oluştu');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', position: '', qualification: '', image: '' });
    setImageFile(null);
    setShowAddForm(false);
    setEditingTrainer(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Eğitmen Kadrosu Yönetimi</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Eğitmen Ekle
        </button>
      </div>

      {/* Eğitmen Ekleme/Düzenleme Formu */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTrainer ? 'Eğitmen Düzenle' : 'Yeni Eğitmen Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pozisyon
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Baş Antrenör, Yardımcı Antrenör"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yeterlilik/Sertifika
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: UEFA A Lisans, TFF B Lisans"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotoğraf
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!imageFile && !editingTrainer && (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Veya fotoğraf URL'si girin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {editingTrainer ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Eğitmen Listesi */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mevcut Eğitmenler</h2>
          {trainers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz eğitmen eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((trainer) => (
                <div key={trainer._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={trainer.image || '/images/default-trainer.jpg'}
                      alt={trainer.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-trainer.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{trainer.name}</h3>
                      <p className="text-sm text-gray-600">{trainer.position}</p>
                      <p className="text-xs text-gray-500">{trainer.qualification}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(trainer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(trainer._id!)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}