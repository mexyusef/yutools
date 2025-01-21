import * as vscode from 'vscode';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { N8N_BASE_URL } from './constants';

export class N8nClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string | undefined;

  constructor() {
    // Initialize the Axios instance with the n8n API base URL
    this.axiosInstance = axios.create({
      baseURL: N8N_BASE_URL, // Replace with your n8n instance URL
      timeout: 5000, // Adjust timeout as needed
    });

    // Load the API key from VS Code settings
    this.apiKey = vscode.workspace.getConfiguration('n8n').get('apiKey');
  }

  /**
   * Set the API key for n8n authentication.
   * @param apiKey The API key to use for n8n requests.
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Trigger a n8n workflow by its ID.
   * @param workflowId The ID of the workflow to trigger.
   * @param data The data to send to the workflow.
   * @returns The response from the n8n API.
   */
  public async triggerWorkflow(workflowId: string, data: any): Promise<AxiosResponse> {
    if (!this.apiKey) {
      throw new Error('API key is not set. Please configure it in VS Code settings.');
    }

    try {
      const response = await this.axiosInstance.post(`/workflows/${workflowId}/trigger`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to trigger workflow: ${error.message}`);
    }
  }

  /**
   * Fetch data from a n8n workflow.
   * @param workflowId The ID of the workflow to fetch data from.
   * @returns The response from the n8n API.
   */
  public async fetchWorkflowData(workflowId: string): Promise<AxiosResponse> {
    if (!this.apiKey) {
      throw new Error('API key is not set. Please configure it in VS Code settings.');
    }

    try {
      const response = await this.axiosInstance.get(`/workflows/${workflowId}/data`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(`Failed to fetch workflow data: ${error.message}`);
    }
  }
}