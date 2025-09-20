import api from './api';

export interface TechnicalStaff {
  _id: string;
  name: string;
  position: 'Teknik Direktör' | 'Yardımcı Antrenör' | 'Kaleci Antrenörü' | 'Kondisyoner' | 'Fizyoterapist' | 'Masör' | 'Malzemeci' | 'Analizci';
  qualification?: string;
  experience?: number;
  biography?: string;
  image: string;
  isActive: boolean;
  joinDate: string;
}

export const getAllStaff = async (): Promise<TechnicalStaff[]> => {
  const response = await api.get('/technical-staff');
  return response.data;
};

export const getStaffById = async (id: string): Promise<TechnicalStaff> => {
  const response = await api.get(`/technical-staff/${id}`);
  return response.data;
};

export const createStaff = async (staff: Omit<TechnicalStaff, '_id'>): Promise<TechnicalStaff> => {
  const response = await api.post('/technical-staff', staff);
  return response.data;
};

export const updateStaff = async (id: string, staff: Partial<TechnicalStaff>): Promise<TechnicalStaff> => {
  const response = await api.put(`/technical-staff/${id}`, staff);
  return response.data;
};

export const deleteStaff = async (id: string): Promise<void> => {
  await api.delete(`/technical-staff/${id}`);
};