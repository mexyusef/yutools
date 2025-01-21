export interface FetchRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  payload?: any; // Default: JSON payload
  authToken?: string; // For Authorization: Bearer <token>
  responseHandler?: (response: Response) => void;
  errorHandler?: (error: any) => void;
}

/**
* Sends an HTTP request using Fetch API.
*/
export const sendFetchRequest = async ({
  url,
  method = 'GET',
  headers = { 'Content-Type': 'application/json' },
  payload = null,
  authToken,
  responseHandler,
  errorHandler
}: FetchRequestOptions): Promise<void> => {
  try {
      if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
      }

      const options: RequestInit = {
          method,
          headers,
          body: payload ? JSON.stringify(payload) : undefined,
      };

      const response = await fetch(url, options);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (responseHandler) {
          responseHandler(response);
      } else {
          const data = await response.json();
          console.log('Response:', data);
      }
  } catch (error) {
      if (errorHandler) {
          errorHandler(error);
      } else {
          console.error('Error:', error);
      }
  }
};
