import api from './api';

export interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  score?: {
    homeTeam: number;
    awayTeam: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const matchService = {
  getAll: async (): Promise<Match[]> => {
    try {
      console.log('Fetching all matches...');
      const response = await api.get('/matches');
      console.log('Matches response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all matches:', error);
      return [];
    }
  },

  getUpcoming: async (): Promise<Match[]> => {
    try {
      console.log('Fetching upcoming matches...');
      const response = await api.get('/matches/upcoming');
      console.log('Upcoming matches response:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Match> => {
    try {
      console.log(`Fetching match with ID: ${id}`);
      const response = await api.get(`/matches/${id}`);
      console.log('Match response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<Match, '_id' | 'createdAt' | 'updatedAt'>): Promise<Match> => {
    try {
      console.log('Creating match with data:', data);
      const response = await api.post('/matches', data);
      console.log('Create match response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Match>): Promise<Match> => {
    try {
      console.log(`Updating match with ID ${id} with data:`, data);
      const response = await api.put(`/matches/${id}`, data);
      console.log('Update match response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating match with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Deleting match with ID: ${id}`);
      await api.delete(`/matches/${id}`);
      console.log(`Match with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting match with ID ${id}:`, error);
      throw error;
    }
  }
}; 