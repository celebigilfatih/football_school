'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, CreateAdminData } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function NewAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAdminData>({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'editor',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.createAdmin(formData);
      toast.success('Yönetici başarıyla oluşturuldu');
      router.push('/admin/admins');
    } catch (err: any) {
      if (err?.response?.status === 403) {
        toast.error('Yetki hatası: Yönetici oluşturmak için superadmin rolüne sahip olmanız gerekmektedir');
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Yönetici oluşturulurken bir hata oluştu');
      }
      console.error('Error creating admin:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Yeni Yönetici Ekle</CardTitle>
          <Link href="/admin/admins">
            <Button variant="outline">Geri Dön</Button>
          </Link>
        </CardHeader>
        <CardContent>
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
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
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
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
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
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 