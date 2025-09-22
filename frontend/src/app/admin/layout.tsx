'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';
import api from '@/services/api';
import { Admin as BaseAdmin } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

// Admin tipini genişletiyorum
type Admin = Omit<BaseAdmin, 'role'> & {
  role: 'admin' | 'editor' | 'superadmin';
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authService.initializeAuth();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Skip auth check for login and register pages
      if (pathname?.includes('/admin/login') || pathname?.includes('/admin/register')) {
        setIsLoading(false);
        return;
      }

      const storedAdmin = authService.getStoredAdmin();
      if (!storedAdmin) {
        router.push('/admin/login');
        return;
      }

      setAdmin(storedAdmin);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    delete api.defaults.headers.common['Authorization'];
    router.push('/admin/login');
  };

  if (isLoading && !pathname?.includes('/admin/login') && !pathname?.includes('/admin/register')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/about', label: 'Hakkımızda', icon: 'ℹ️' },
    { href: '/admin/club', label: 'Kulüp Bilgileri', icon: '🏢' },
    { href: '/admin/groups', label: 'Takımlar', icon: '⚽' },
    { href: '/admin/players', label: 'A Takım', icon: '👥' },
    { href: '/admin/technical-staff', label: 'Teknik Kadro', icon: '⚽' },
    { href: '/admin/egitmen-kadro', label: 'Eğitmen Kadrosu', icon: '🎓' },
    { href: '/admin/matches', label: 'Maç Takvimi', icon: '📅' },
    { href: '/admin/news', label: 'Haberler', icon: '📰' },
    { href: '/admin/announcements', label: 'Duyurular', icon: '📢' },
    { href: '/admin/messages', label: 'Mesajlar', icon: '✉️' },
    { href: '/admin/admins', label: 'Yöneticiler', icon: '👥' },
  ];

  // Don't render the admin layout for the login and register pages
  if (pathname?.includes('/admin/login') || pathname?.includes('/admin/register')) {
    return children;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r min-h-screen p-4">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center space-x-2 mb-6">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b border-border">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                {pathname === '/admin' && 'Dashboard'}
                {pathname === '/admin/about' && 'Hakkımızda'}
                {pathname === '/admin/club' && 'Kulüp Bilgileri'}
                {pathname === '/admin/groups' && 'Takımlar'}
                {pathname.includes('/admin/groups/') && !pathname.includes('/new') && 'Takım Detayları'}
                {pathname === '/admin/groups/new' && 'Yeni Takım Ekle'}
                {pathname === '/admin/players' && 'A Takım'}
                {pathname.includes('/admin/players/') && !pathname.includes('/new') && 'Oyuncu Detayları'}
                {pathname === '/admin/players/new' && 'Yeni Oyuncu Ekle'}
                {pathname === '/admin/technical-staff' && 'Teknik Kadro'}
                {pathname.includes('/admin/technical-staff/') && !pathname.includes('/new') && 'Teknik Personel Detayları'}
                {pathname === '/admin/technical-staff/new' && 'Yeni Teknik Personel Ekle'}
                {pathname === '/admin/egitmen-kadro' && 'Eğitmen Kadrosu'}
                {pathname === '/admin/matches' && 'Maç Takvimi'}
                {pathname.includes('/admin/matches/') && !pathname.includes('/new') && 'Maç Detayları'}
                {pathname === '/admin/matches/new' && 'Yeni Maç Ekle'}
                {pathname === '/admin/news' && 'Haberler'}
                {pathname.includes('/admin/news/') && !pathname.includes('/new') && 'Haber Detayları'}
                {pathname === '/admin/news/new' && 'Yeni Haber Ekle'}
                {pathname === '/admin/announcements' && 'Duyurular'}
                {pathname.includes('/admin/announcements/') && !pathname.includes('/new') && 'Duyuru Detayları'}
                {pathname === '/admin/announcements/new' && 'Yeni Duyuru Ekle'}
                {pathname === '/admin/messages' && 'Mesajlar'}
                {pathname.includes('/admin/messages/') && 'Mesaj Detayları'}
                {pathname === '/admin/admins' && 'Yöneticiler'}
                {pathname.includes('/admin/admins/') && !pathname.includes('/new') && 'Yönetici Detayları'}
                {pathname === '/admin/admins/new' && 'Yeni Yönetici Ekle'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {admin && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{admin.name}</span>
                  <div className={`px-2 py-1 text-xs rounded-full ${
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
                  </div>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                Çıkış Yap
              </Button>
            </div>
          </div>
        </header>
        
        {admin && admin.role !== 'superadmin' && pathname.includes('/admin/admins') && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Yönetici listesine erişim için <span className="font-medium">superadmin</span> rolüne sahip olmanız gerekmektedir. 
                  Şu anki rolünüz: <span className="font-medium">{admin.role}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            isAuthenticated && children
          )}
        </main>
      </div>
    </div>
  );
}