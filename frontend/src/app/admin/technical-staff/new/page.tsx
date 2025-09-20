'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TechnicalStaff } from '@/services/technicalStaff.service';
import { createStaff } from '@/services/technicalStaff.service';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

type StaffPosition = TechnicalStaff['position'];

export default function NewTechnicalStaffPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    position: '' as StaffPosition,
    qualification: '',
    experience: 0,
    biography: '',
    image: '',
    isActive: true,
    joinDate: new Date().toISOString()
  });
  const [imagePreview, setImagePreview] = useState<string>('/staff-placeholder.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check authentication
    const admin = authService.getStoredAdmin();
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    // Initialize auth headers
    authService.initializeAuth();
  }, [router]);

  const handleChange = (name: string, value: string | number) => {
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
      if (!formData.name.trim()) {
        toast.error('İsim alanı zorunludur');
        setIsSubmitting(false);
        return;
      }

      if (!formData.position) {
        toast.error('Pozisyon seçimi zorunludur');
        setIsSubmitting(false);
        return;
      }

      const staffData = {
        ...formData,
        name: formData.name.trim(),
      };

      await createStaff(staffData);
      toast.success('Teknik ekip üyesi başarıyla eklendi');
      router.push('/admin/technical-staff');
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error ||
                         'Teknik ekip üyesi eklenirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Teknik Ekip Üyesi Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification">Yeterlilik</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  placeholder="Yeterlilik bilgisi giriniz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Deneyim (Yıl)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography">Biyografi</Label>
                <textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => handleChange('biography', e.target.value)}
                  placeholder="Biyografi bilgisi giriniz"
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
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

              <div className="space-y-2">
                <Label htmlFor="image">Fotoğraf</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Staff preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, GIF dosyaları (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
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
        </CardContent>
      </Card>
    </div>
  );
}