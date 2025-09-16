import api from './api';

interface Group {
  _id: string;
  name: string;
}

export interface Announcement {
  _id: string;
  id?: string;
  title: string;
  content: string;
  priority: 'Düşük' | 'Normal' | 'Yüksek' | 'Acil';
  startDate: string;
  endDate: string;
  targetGroups: (string | Group)[];
  isActive: boolean;
}

export const announcementService = {
  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get('/announcements');
    return response.data;
  },

  getById: async (id: string): Promise<Announcement> => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  create: async (data: Omit<Announcement, 'id'>): Promise<Announcement> => {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Announcement>): Promise<Announcement> => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  }
}; 