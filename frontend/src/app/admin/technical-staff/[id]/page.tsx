'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getStaffById, updateStaff, type TechnicalStaff } from '@/services/technicalStaff.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type StaffPosition = TechnicalStaff['position'];

export default function EditTechnicalStaffPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('/staff-placeholder.jpg');
  const [formData, setFormData] = useState({
    name: '',
    position: 'Teknik Direktör' as StaffPosition,
    qualification: '',
    experience: 0,
    biography: '',
    image: '/staff-placeholder.jpg',
    isActive: true,
    joinDate: new Date().toISOString()
  });

  useEffect(() => {
    fetchStaffMember();
  }, []);

  const fetchStaffMember = async () => {
    try {
      const data = await getStaffById(params.id);
      setFormData({
        name: data.name,
        position: data.position,
        qualification: data.qualification,
        experience: data.experience,
        biography: data.biography || '',
        image: data.image,
        isActive: data.isActive,
        joinDate: data.joinDate
      });
      setImagePreview(data.image);
    } catch (error) {
      toast.error('Teknik ekip üyesi bilgileri yüklenirken bir hata oluştu');
      router.push('/admin/technical-staff');
    }
  };

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resim boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, image: base64 }));
    } catch (error) {
      toast.error('Resim yüklenirken bir hata oluştu');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.position || !formData.qualification) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      setLoading(false);
      return;
    }

    try {
      await updateStaff(params.id, formData);
      toast.success('Teknik ekip üyesi başarıyla güncellendi');
      router.push('/admin/technical-staff');
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teknik Ekip Üyesi Düzenle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Kolon */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ad Soyad giriniz"
                />
              </div>

              <div>
                <Label htmlFor="position">Pozisyon</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value: StaffPosition) => handleChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pozisyon seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Teknik Direktör">Teknik Direktör</SelectItem>
                    <SelectItem value="Yardımcı Antrenör">Yardımcı Antrenör</SelectItem>
                    <SelectItem value="Kaleci Antrenörü">Kaleci Antrenörü</SelectItem>
                    <SelectItem value="Kondisyoner">Kondisyoner</SelectItem>
                    <SelectItem value="Fizyoterapist">Fizyoterapist</SelectItem>
                    <SelectItem value="Masör">Masör</SelectItem>
                    <SelectItem value="Malzemeci">Malzemeci</SelectItem>
                    <SelectItem value="Analizci">Analizci</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qualification">Yeterlilik</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  placeholder="Yeterlilik bilgisi giriniz"
                />
              </div>

              <div>
                <Label htmlFor="experience">Deneyim (Yıl)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-4">
              <div>
                <Label>Fotoğraf</Label>
                <div className="mt-2 flex flex-col items-center space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-48 h-48 rounded-lg object-cover border"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Maksimum dosya boyutu: 5MB
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="biography">Biyografi</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => handleChange('biography', e.target.value)}
                  placeholder="Kısa biyografi..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Kaydet'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 