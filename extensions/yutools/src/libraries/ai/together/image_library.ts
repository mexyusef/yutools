import Together from "together-ai";
import ImgurUploader from "./image_upload";
import { togetherSettings } from "../config";
// npm install together-ai

interface ImageGenerationSettings {
  model: string;
  width: number;
  height: number;
  steps: number;
}

class ImageGenerationLibrary {
  private together: Together;
  private defaultSettings: ImageGenerationSettings;
  private imgurUploader: ImgurUploader;

  constructor(
    initialSettings: Partial<ImageGenerationSettings> = {},
    imgurClientId?: string,
  ) {
    this.together = new Together({ apiKey: togetherSettings.getNextProvider().key });
    this.imgurUploader = new ImgurUploader(
      imgurClientId
    );
    this.defaultSettings = {
      model: "black-forest-labs/FLUX.1-depth",
      width: 1024,
      height: 1024,
      steps: 28,
      ...initialSettings,
    };
  }

  setDefaultSettings(newSettings: Partial<ImageGenerationSettings>) {
    this.defaultSettings = { ...this.defaultSettings, ...newSettings };
  }

  async generateImage(
    prompt: string,
    imageUrl?: string,
    width: number = this.defaultSettings.width,
    height: number = this.defaultSettings.height,
    steps: number = this.defaultSettings.steps
  ): Promise<string | null> {
    try {
      const response = await this.together.images.create({
        model: this.defaultSettings.model,
        width,
        height,
        steps,
        prompt,
        image_url: imageUrl,
      });

      // @ts-ignore
      return response.data[0]?.url || null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

  async uploadImage2(filePath: string): Promise<string | null> {
    try {
      const fileName = filePath.split('/').pop() || "uploaded_image";
      const formData = new FormData();
      formData.append("file", new Blob([filePath]), fileName);

      const response = await fetch("https://freeimage.host/api/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.image.url;
      } else {
        console.error("Error uploading image:", data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }

  async uploadImage(filePath: string): Promise<string | null> {
    try {
      const imageUrl = await this.imgurUploader.uploadFile(filePath);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }

  async uploadBase64Image(base64Image: string): Promise<string | null> {
    try {
      const imageUrl = await this.imgurUploader.uploadBase64(base64Image);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading base64 image:", error);
      return null;
    }
  }

}

export default ImageGenerationLibrary;
