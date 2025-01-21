export interface IUploadOptions {
  public_id?: string;
  folder?: string;
  overwrite?: boolean;
  [key: string]: any; // Allow additional Cloudinary options
}
