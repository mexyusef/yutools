export interface ITransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  fetch_format?: string;
  [key: string]: any; // Allow additional Cloudinary options
}