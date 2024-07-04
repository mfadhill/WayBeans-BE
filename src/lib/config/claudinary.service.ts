import { Injectable } from '@nestjs/common'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'
import toStream = require('buffer-to-stream')
import { Logger } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);
    private extractPublicId(secureUrl: string): string {
        const urlParts = secureUrl.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExtension.split('.')[0];
        const publicId = urlParts.slice(7, urlParts.length - 1).join('/') + '/' + fileName;

        return publicId;
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
    }
    async deleteFile(secureUrl: string): Promise<any> {
        try {
            const publicId = this.extractPublicId(secureUrl)
            const result = await v2.uploader.destroy(publicId);
            this.logger.log(`File with publicId ${publicId} deleted successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to delete file with publicId ${secureUrl}`, error.stack);
            throw new Error('Failed to delete file from Cloudinary');
        }
    }
}