import api from './api';

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: 'registration' | 'info' | 'complaint' | 'other';
  message: string;
}

export interface ContactMessage extends ContactForm {
  id: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export const contactService = {
  sendMessage: async (data: ContactForm): Promise<{ message: string; data: ContactMessage }> => {
    const response = await api.post('/contact/send', data);
    return response.data;
  },

  // Admin functions
  getAllMessages: async (): Promise<ContactMessage[]> => {
    const response = await api.get('/contact/messages');
    return response.data;
  },

  getMessageById: async (id: string): Promise<ContactMessage> => {
    const response = await api.get(`/contact/messages/${id}`);
    return response.data;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/contact/messages/${id}`);
  }
}; 