import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'superadmin';
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface CreateAdminData {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'superadmin';
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'superadmin';
  isActive?: boolean;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { token, admin } = response.data;
    
    // Token'ı localStorage'a kaydet
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    
    // API instance'ına Authorization header'ını ekle
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ message: string; admin: Admin }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: () => {
    // Token ve admin bilgilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    
    // API instance'ından Authorization header'ını kaldır
    delete api.defaults.headers.common['Authorization'];
  },

  getProfile: async (): Promise<Admin> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  createAdmin: async (data: CreateAdminData): Promise<{ message: string; admin: Admin }> => {
    const response = await api.post('/auth/create', data);
    return response.data;
  },

  getAllAdmins: async (): Promise<Admin[]> => {
    try {
      const response = await api.get('/auth/admins');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.error('Yetki hatası: Superadmin rolüne sahip değilsiniz');
      }
      throw error;
    }
  },

  getAdminById: async (id: string): Promise<Admin> => {
    const response = await api.get(`/auth/admins/${id}`);
    return response.data;
  },

  updateAdmin: async (id: string, data: UpdateAdminData): Promise<{ message: string; admin: Admin }> => {
    const response = await api.put(`/auth/admins/${id}`, data);
    return response.data;
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/auth/admins/${id}`);
  },

  // Token'ı kontrol et ve API instance'ını yapılandır
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  // Admin bilgilerini localStorage'dan al
  getStoredAdmin: (): Admin | null => {
    const adminStr = localStorage.getItem('admin');
    return adminStr ? JSON.parse(adminStr) : null;
  },

  // Admin'in rolünü kontrol et
  isAdmin: (): boolean => {
    const admin = authService.getStoredAdmin();
    return admin?.role === 'admin';
  }
};