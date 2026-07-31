import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      this.logger.log(`Cloudinary initialized for cloud: ${cloudName}`);
    } else {
      this.logger.warn('Cloudinary credentials missing. File uploads will run in local mock mode.');
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, folder = 'tenders'): Promise<string> {
    if (!this.isConfigured) {
      this.logger.log(`[Mock Storage] Uploaded ${fileName} to mock storage path /uploads/${fileName}`);
      return `/uploads/${Date.now()}-${fileName}`;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `ai-bid/${folder}`,
          resource_type: 'auto',
          public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            return reject(error);
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(fileBuffer);
    });
  }
}
