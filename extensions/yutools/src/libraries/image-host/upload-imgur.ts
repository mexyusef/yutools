import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ImageUploader } from './upload-base';

export class ImgurUploader implements ImageUploader {
  private readonly clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async upload(imagePath: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        Authorization: `Client-ID ${this.clientId}`,
        ...formData.getHeaders(),
      },
    });

    if (response.status !== 200 || !response.data.data.link) {
      throw new Error('Failed to upload image to Imgur');
    }

    return response.data.data.link;
  }
}