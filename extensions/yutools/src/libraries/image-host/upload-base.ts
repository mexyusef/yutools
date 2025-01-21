export interface ImageUploader {
  upload(imagePath: string): Promise<string>;
}
