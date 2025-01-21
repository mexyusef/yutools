import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { ApiResponse } from '@/shared/types';

export async function makeApiRequest(prompt: string, endpoint: string = '/quickQuery'): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, { prompt }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse = response.data as ApiResponse;
    return data.response;
  } catch (error: any) {
    throw new Error(`API request failed: ${error.message}`);
  }
}