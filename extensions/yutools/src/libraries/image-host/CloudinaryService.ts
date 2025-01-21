import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryConfig } from './ICloudinaryConfig';
import { IUploadOptions } from './IUploadOptions';
import { ITransformOptions } from './ITransformOptions';

export class CloudinaryService {
  constructor(config: ICloudinaryConfig) {
    cloudinary.config(config);
  }

  /**
   * Upload an image to Cloudinary.
   * @param filePath - Path to the image file or a remote URL.
   * @param options - Upload options.
   * @returns The uploaded image details.
   */
  async uploadImage(filePath: string, options: IUploadOptions = {}) {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Generate an optimized URL for an image.
   * @param publicId - The public ID of the image.
   * @param options - Transform options.
   * @returns The optimized image URL.
   */
  getOptimizedUrl(publicId: string, options: ITransformOptions = {}) {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options,
    });
  }

  /**
   * Generate a transformed URL for an image.
   * @param publicId - The public ID of the image.
   * @param options - Transform options.
   * @returns The transformed image URL.
   */
  getTransformedUrl(publicId: string, options: ITransformOptions = {}) {
    return cloudinary.url(publicId, options);
  }
}
