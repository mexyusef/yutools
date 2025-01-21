import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { ApiResponse } from './types';

export async function generalSingleQuery(prompt: string, endpoint: string): Promise<string> {
	const response = await axios.post(`${API_BASE_URL}${endpoint}`, { prompt }, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data: ApiResponse = response.data as ApiResponse;
	return data.response;
}
