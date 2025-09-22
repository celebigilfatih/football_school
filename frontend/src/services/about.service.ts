import api from './api';

export interface About {
  title: string;
  content: string;
  trainers: Array<{
    _id?: string;
    name: string;
    position: string;
    image: string;
    qualification: string;
  }>;
  heroImage: string;
  updatedAt: string;
}

export const aboutService = {
  getAbout: async (): Promise<About> => {
    const response = await api.get('/about');
    return response.data;
  },

  updateAbout: async (data: Partial<About>): Promise<About> => {
    const response = await api.put('/about', data);
    return response.data;
  },

  addTrainer: async (trainer: Omit<About['trainers'][0], '_id'>): Promise<About> => {
    const response = await api.post('/about/trainers', trainer);
    return response.data;
  },

  addTrainerWithImage: async (formData: FormData): Promise<About> => {
    const response = await api.post('/about/trainers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateTrainer: async (trainerId: string, data: Partial<About['trainers'][0]>): Promise<About> => {
    const response = await api.put(`/about/trainers/${trainerId}`, data);
    return response.data;
  },

  updateTrainerWithImage: async (trainerId: string, formData: FormData): Promise<About> => {
    const response = await api.put(`/about/trainers/${trainerId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTrainer: async (trainerId: string): Promise<void> => {
    await api.delete(`/about/trainers/${trainerId}`);
  }
};