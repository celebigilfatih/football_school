'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, UpdateAdminData } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Admin as BaseAdmin } from '@/services/auth.service';

// Admin tipini genişletiyorum
type Admin = Omit<BaseAdmin, 'role'> & {
  role: 'admin' | 'editor' | 'superadmin';
};

export default function EditAdmin({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<UpdateAdminData>({
    name: '',
    email: '',
    role: 'editor',
    isActive: true,
  });

  useEffect(() => {
    fetchAdmin();
  }, [params.id]);

  const fetchAdmin = async () => {
    try {
      const data = await authService.getAdminById(params.id);
      setAdmin(data as Admin);
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role as 'admin' | 'editor' | 'superadmin',
        isActive: data.isActive,
      });
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast.error('Yetki hatası: Yönetici bilgilerini görüntülemek için superadmin rolüne sahip olmanız gerekmektedir');
        router.push('/admin/admins');
      } else {
        toast.error('Yönetici bilgileri yüklenirken bir hata oluştu');
      }
      console.error('Error fetching admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      role: value as 'admin' | 'editor' | 'superadmin' 
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await authService.updateAdmin(params.id, formData);
      toast.success('Yönetici başarıyla güncellendi');
      router.push('/admin/admins');
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast.error('Yetki hatası: Yönetici güncellemek için superadmin rolüne sahip olmanız gerekmektedir');
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Yönetici güncellenirken bir hata oluştu');
      }
      console.error('Error updating admin:', err);
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

  if (!admin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-lg text-red-600">Yönetici bulunamadı</p>
              <Link href="/admin/admins" className="mt-4 inline-block">
                <Button variant="outline">Geri Dön</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentAdmin = authService.getStoredAdmin();
  const isSelfEdit = currentAdmin?.id === admin.id;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Yönetici Düzenle</CardTitle>
          <Link href="/admin/admins">
            <Button variant="outline">Geri Dön</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isSelfEdit && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Kendi hesabınızı düzenliyorsunuz. Rol değişikliği ve hesap durumu değişikliği yapılamaz.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                  disabled={isSelfEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Süper Admin</SelectItem>
                    <SelectItem value="admin">Yönetici</SelectItem>
                    <SelectItem value="editor">Editör</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive" className="block mb-2">Durum</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isActive" 
                    checked={formData.isActive} 
                    onCheckedChange={handleActiveChange}
                    disabled={isSelfEdit}
                  />
                  <Label htmlFor="isActive">
                    {formData.isActive ? 'Aktif' : 'Pasif'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 