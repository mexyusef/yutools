import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { MultiQueriesResponse } from './types';

export async function generalMultiQuery(prompt: string, endpoint: string): Promise<string[]> {
	const response = await axios.post(`${API_BASE_URL}${endpoint}`, { prompt }, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data: MultiQueriesResponse = response.data as MultiQueriesResponse;
	return data.response;
}
