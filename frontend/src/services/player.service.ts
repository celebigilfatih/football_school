import api from './api';

export interface Player {
  _id: string;
  name: string;
  position: 'Kaleci' | 'Defans' | 'Orta Saha' | 'Forvet';
  number: number;
  birthDate: string;
  nationality: string;
  height: number;
  weight: number;
  image: string;
  stats: {
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  isActive: boolean;
  joinDate: string;
}

export const getAllPlayers = async (): Promise<Player[]> => {
  const response = await api.get('/players');
  return response.data;
};

export const getPlayerById = async (id: string): Promise<Player> => {
  const response = await api.get(`/players/${id}`);
  return response.data;
};

export const createPlayer = async (player: Omit<Player, '_id'>): Promise<Player> => {
  const response = await api.post('/players', player);
  return response.data;
};

export const updatePlayer = async (id: string, player: Partial<Player>): Promise<Player> => {
  const response = await api.put(`/players/${id}`, player);
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await api.delete(`/players/${id}`);
}; 