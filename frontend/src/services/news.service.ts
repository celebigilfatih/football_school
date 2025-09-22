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
    try {
      console.log('Fetching news from API...');
      console.log('API base URL:', api.defaults.baseURL);
      const response = await api.get('/news');
      console.log('News API response status:', response.status);
      console.log('News API response data:', response.data);
      console.log('News API response data length:', response.data?.length);
      return response.data;
    } catch (error) {
      console.error('Error in newsService.getAll:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  getById: async (id: string): Promise<News> => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in newsService.getById:', error);
      throw error;
    }
  },

  create: async (data: Omit<News, '_id'>): Promise<News> => {
    try {
      const response = await api.post('/news', data);
      return response.data;
    } catch (error) {
      console.error('Error in newsService.create:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<News>): Promise<News> => {
    try {
      const response = await api.put(`/news/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in newsService.update:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/news/${id}`);
    } catch (error) {
      console.error('Error in newsService.delete:', error);
      throw error;
    }
  }
};