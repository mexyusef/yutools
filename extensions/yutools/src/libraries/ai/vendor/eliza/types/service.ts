export interface Service {
  name: string; // Name of the service (e.g., "image-generation")
  initialize: () => Promise<void>; // Initialize the service
  cleanup: () => Promise<void>; // Clean up resources used by the service
  [key: string]: any; // Additional methods or properties
}