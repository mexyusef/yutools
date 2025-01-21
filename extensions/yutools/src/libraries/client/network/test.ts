import { sendRequest } from "./axiosHelper";
import { sendFetchRequest } from "./fetchHelper";

// Example: Using Axios for GET request
const testAxiosRequest = async () => {
    await sendRequest({
        url: 'https://api.example.com/resource',
        method: 'GET',
        authToken: 'your_auth_token_here',
        responseHandler: (response: { data: any; }) => {
            console.log('Axios Response:', response.data);
        },
        errorHandler: (error: { message: any; }) => {
            console.error('Axios Error:', error.message);
        },
    });
};

// Example: Using Fetch for POST request
const testFetchRequest = async () => {
    await sendFetchRequest({
        url: 'https://api.example.com/resource',
        method: 'POST',
        payload: { key: 'value' },
        authToken: 'your_auth_token_here',
        responseHandler: async (response: { json: () => any; }) => {
            const data = await response.json();
            console.log('Fetch Response:', data);
        },
        errorHandler: (error: { message: any; }) => {
            console.error('Fetch Error:', error.message);
        },
    });
};
