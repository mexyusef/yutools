import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ImageUploader } from './upload-base';

export class CloudinaryUploader implements ImageUploader {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(cloudName: string, apiKey: string, apiSecret: string) {
    this.cloudName = cloudName;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async upload(imagePath: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));
    formData.append('upload_preset', 'your_upload_preset'); // Optional: Set a default upload preset

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData,
      {
        auth: {
          username: this.apiKey,
          password: this.apiSecret,
        },
        headers: formData.getHeaders(),
      }
    );

    if (response.status !== 200 || !response.data.secure_url) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    return response.data.secure_url;
  }
}