import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "flashcards" }, // locate in cloudinary
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error("Upload failed: no result returned"));
          resolve(result as UploadApiResponse);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
