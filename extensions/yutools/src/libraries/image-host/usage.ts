import { CloudinaryService, ICloudinaryConfig, IUploadOptions, ITransformOptions } from 'cloudinary-library';

// Configuration
const config: ICloudinaryConfig = {
  cloud_name: '<cloud name parameter>',
  api_key: '<api key parameter>',
  api_secret: '<your_api_secret>',
};

// Initialize the service
const cloudinaryService = new CloudinaryService(config);

// Upload an image
(async function () {
  const uploadOptions: IUploadOptions = {
    public_id: 'shoes',
    folder: 'products',
  };

  const uploadResult = await cloudinaryService.uploadImage(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
    uploadOptions
  );
  console.log('Upload Result:', uploadResult);

  // Generate an optimized URL
  const optimizeUrl = cloudinaryService.getOptimizedUrl('shoes');
  console.log('Optimized URL:', optimizeUrl);

  // Generate a transformed URL
  const transformOptions: ITransformOptions = {
    crop: 'auto',
    gravity: 'auto',
    width: 500,
    height: 500,
  };
  const transformedUrl = cloudinaryService.getTransformedUrl('shoes', transformOptions);
  console.log('Transformed URL:', transformedUrl);
})();