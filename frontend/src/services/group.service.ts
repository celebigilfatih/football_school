import api from './api';

export interface Player {
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  capacity?: number;
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  trainer: {
    name: string;
    qualification: string;
  };
  players?: Player[];
  isActive: boolean;
  createdAt?: Date;
}

export const groupService = {
  getAll: async (): Promise<Group[]> => {
    const response = await api.get('/groups');
    return response.data;
  },

  getById: async (id: string): Promise<Group> => {
    try {
      const response = await api.get(`/groups/${id}`);
      
      // Ensure players array exists
      const data = {
        ...response.data,
        players: response.data.players || [],
        imageUrl: response.data.imageUrl || ''
      };
      
      console.log('Processed group data:', data);
      return data;
    } catch (error) {
      console.error('Error in getById group service:', error);
      throw error;
    }
  },

  create: async (data: Omit<Group, '_id'>, imageFile?: File): Promise<Group> => {
    try {
      console.log('Creating group with data:', data);
      
      // Ensure required fields are present
      if (!data.name) {
        throw new Error('Name is required');
      }
      
      if (!data.description) {
        throw new Error('Description is required');
      }
      
      if (!data.trainer || !data.trainer.name || !data.trainer.qualification) {
        throw new Error('Trainer name and qualification are required');
      }
      
      // Set default type if not provided
      if (!data.type) {
        data = {
          ...data,
          type: 'Alt Yapı'
        };
      }

      // Ensure players array exists
      if (!data.players) {
        data.players = [];
      }
      
      // If there's an image file, use FormData
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Convert data to a string that preserves arrays and nested objects
        const jsonData = JSON.stringify({
          ...data,
          players: data.players
        });
        formData.append('data', jsonData);
        
        console.log('Sending form data with image:', jsonData);
        const response = await api.post('/groups', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // No image, just send JSON data
        console.log('Sending JSON data without image:', data);
        const response = await api.post('/groups', data);
        return response.data;
      }
    } catch (error) {
      console.error('Error in create group service:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Group>, imageFile?: File): Promise<Group> => {
    try {
      console.log('Updating group with data:', data);
      
      // Ensure players array exists
      if (!data.players) {
        data.players = [];
      }
      
      // If there's an image file, use FormData
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Convert data to a string that preserves arrays and nested objects
        const jsonData = JSON.stringify({
          ...data,
          players: data.players
        });
        formData.append('data', jsonData);
        
        console.log('Sending form data with image:', jsonData);
        const response = await api.put(`/groups/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // No image, just send JSON data with players array
        console.log('Sending JSON data without image:', data);
        const response = await api.put(`/groups/${id}`, {
          ...data,
          players: data.players
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error in update group service:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  }
}; 