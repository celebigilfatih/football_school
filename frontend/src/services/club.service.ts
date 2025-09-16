import api from './api';

export interface Club {
  _id?: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
  };
  updatedAt: string;
}

export const clubService = {
  getClubInfo: async (): Promise<Club> => {
    const timestamp = new Date().getTime();
    const response = await api.get(`/club?_t=${timestamp}`);
    return response.data;
  },

  updateClubInfo: async (formData: FormData): Promise<{ message: string; club: Club }> => {
    console.log("updateClubInfo çağrıldı, formData:", formData);
    
    // FormData içeriğini kontrol et
    console.log("FormData içeriği:");
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
    });
    
    try {
      const response = await api.put('/club', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("API yanıtı:", response);
      
      localStorage.removeItem('clubInfo');
      
      return response.data;
    } catch (error) {
      console.error("API hatası:", error);
      throw error;
    }
  }
}; 