// import {
//   Injectable,
//   NestMiddleware,
//   BadRequestException,
// } from "@nestjs/common";
// import { Request, Response, NextFunction } from "express";

// @Injectable()
// export class ValidateImageMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     // Nếu không phải type = 'image' thì không cần check file
//     if (req.body.type !== "image") {
//       return next();
//     }

//     const file = req.file;

//     // Nếu type = image thì bắt buộc phải có file
//     if (!file) {
//       throw new BadRequestException("File image is required.");
//     }

//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//     if (!allowedTypes.includes(file.mimetype)) {
//       throw new BadRequestException(
//         `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
//       );
//     }

//     // Check giới hạn kích thước (2MB)
//     const maxSize = 2 * 1024 * 1024;
//     if (file.size > maxSize) {
//       throw new BadRequestException("File size exceeds 2MB limit.");
//     }

//     next();
//   }
// }
