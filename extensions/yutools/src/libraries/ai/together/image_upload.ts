import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// yu314 claude https://claude.ai/chat/8919892a-a2df-4759-bb87-1b44d781f057
// yu314 https://api.imgur.com/oauth2/addclient
// Great! Now you can get started with the API!
// For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

// Authorization: Client-ID YOUR_CLIENT_ID

// For accessing a user's account, please visit the OAuth2 section of the docs.

// Client ID: 0ce74b40c0356ca
// Client secret: 0566b4326c7b6fe442ff75f3597fc523adce9204

const defaultClientId = '0ce74b40c0356ca';

interface ImgurResponse {
  data: {
    link: string;
    deletehash?: string;
  };
  success: boolean;
  status: number;
}

class ImgurUploader {
  private clientId: string;
  private apiUrl: string = 'https://api.imgur.com/3/image';

  constructor(clientId: string = defaultClientId) {
    this.clientId = clientId;
  }

  async uploadFile(filePath: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(filePath));

      const response = await axios.post<ImgurResponse>(this.apiUrl, formData, {
        headers: {
          Authorization: `Client-ID ${this.clientId}`,
          ...formData.getHeaders(),
        },
      });

      if (response.data.success) {
        return response.data.data.link;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      throw new Error('Upload failed with unknown error');
    }
  }

  async uploadBase64(base64Image: string): Promise<string> {
    try {
      const response = await axios.post<ImgurResponse>(
        this.apiUrl,
        {
          image: base64Image.replace(/^data:image\/[a-z]+;base64,/, '')
        },
        {
          headers: {
            Authorization: `Client-ID ${this.clientId}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data.link;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      throw new Error('Upload failed with unknown error');
    }
  }
}

export default ImgurUploader;
