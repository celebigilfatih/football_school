'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Admin as BaseAdmin, authService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Admin tipini genişletiyorum
type Admin = Omit<BaseAdmin, 'role'> & {
  role: 'admin' | 'editor' | 'superadmin';
};

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      const data = await authService.getAllAdmins();
      setAdmins(data);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('Bu sayfaya erişim için superadmin yetkisine sahip olmanız gerekmektedir. Normal admin veya editör hesapları bu sayfaya erişemez.');
        toast.error('Yetki hatası: Superadmin rolüne sahip değilsiniz');
      } else {
        setError('Yöneticiler yüklenirken bir hata oluştu');
        toast.error('Yöneticiler yüklenirken bir hata oluştu');
      }
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu yöneticiyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleteId(id);
    try {
      await authService.deleteAdmin(id);
      await fetchAdmins();
      toast.success('Yönetici başarıyla silindi');
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('Yönetici silme işlemi için superadmin yetkisine sahip olmanız gerekmektedir.');
        toast.error('Yetki hatası: Superadmin rolüne sahip değilsiniz');
      } else {
        setError('Yönetici silinirken bir hata oluştu');
        toast.error('Yönetici silinirken bir hata oluştu');
      }
      console.error('Error deleting admin:', err);
    } finally {
      setDeleteId(null);
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
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Yöneticiler</CardTitle>
          <Link href="/admin/admins/new">
            <Button>Yeni Yönetici Ekle</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
              {error}
            </div>
          )}

          {!error && (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ad Soyad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Kullanıcı Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      E-posta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{admin.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{admin.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.role === 'superadmin'
                            ? 'bg-amber-100 text-amber-800'
                            : admin.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {admin.role === 'superadmin' 
                            ? 'Süper Admin' 
                            : admin.role === 'admin' 
                              ? 'Yönetici' 
                              : 'Editör'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/admins/${admin.id}`}
                          className="text-primary hover:text-primary/80 mr-4"
                        >
                          Düzenle
                        </Link>
                        {admin.id !== authService.getStoredAdmin()?.id && (
                          <button
                            onClick={() => handleDelete(admin.id)}
                            disabled={deleteId === admin.id}
                            className={`text-destructive hover:text-destructive/80 ${
                              deleteId === admin.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deleteId === admin.id ? 'Siliniyor...' : 'Sil'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {admins.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Henüz yönetici bulunmuyor.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 