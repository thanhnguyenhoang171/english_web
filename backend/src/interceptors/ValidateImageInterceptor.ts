import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ValidateImageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.body?.type === "image") {
      const file = req.file;
      const isCreate = req.method === "POST";

      if (isCreate && !file) {
        throw new BadRequestException("File image is required.");
      }

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
          throw new BadRequestException(
            `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
          );
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          throw new BadRequestException("File size exceeds 2MB limit.");
        }
      }
    }

    return next.handle();
  }
}
