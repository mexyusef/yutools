import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    payload?: any; // Default: JSON payload
    authToken?: string; // For Authorization: Bearer <token>
    responseHandler?: (response: AxiosResponse) => void;
    errorHandler?: (error: any) => void;
}

/**
 * Sends an HTTP request using Axios.
 */
export const sendRequest = async ({
    url,
    method = 'GET',
    headers = { 'Content-Type': 'application/json' },
    payload = null,
    authToken,
    responseHandler,
    errorHandler
}: RequestOptions): Promise<void> => {
    try {
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const config: AxiosRequestConfig = {
            method,
            url,
            headers,
            data: payload,
        };

        const response = await axios(config);

        if (responseHandler) {
            responseHandler(response);
        } else {
            console.log('Response:', response.data);
        }
    } catch (error) {
        if (errorHandler) {
            errorHandler(error);
        } else {
            console.error('Error:', error);
        }
    }
};
