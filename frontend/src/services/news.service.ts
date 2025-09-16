import api from './api';

export interface News {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  category: 'Genel' | 'Turnuva' | 'Eğitim' | 'Başarı' | 'Diğer';
  author: string;
  isPublished: boolean;
  publishDate: string;
  tags: string[];
}

export const newsService = {
  getAll: async (): Promise<News[]> => {
    const response = await api.get('/news');
    return response.data;
  },

  getById: async (id: string): Promise<News> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (data: Omit<News, '_id'>): Promise<News> => {
    const response = await api.post('/news', data);
    return response.data;
  },

  update: async (id: string, data: Partial<News>): Promise<News> => {
    const response = await api.put(`/news/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/news/${id}`);
  }
}; 