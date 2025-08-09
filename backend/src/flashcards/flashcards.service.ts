import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateFlashcardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashcardDto } from "./dto/update-flashcard.dto";
import { IUser } from "src/interfaces/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Flashcard, FlashcardDocument } from "./schemas/flashcard.schema";
import * as softDeletePluginMongoose from "soft-delete-plugin-mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { extractPublicIdFromUrl } from "src/utils/extract-public-id-from-url";

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: softDeletePluginMongoose.SoftDeleteModel<FlashcardDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createFlashcardDto: CreateFlashcardDto,
    user: IUser,
    file?: Express.Multer.File,
  ) {
    let frontImageUrl: string | null = null;
    let frontText: string | null = null;

    if (createFlashcardDto.type === "text") {
      if (!createFlashcardDto.frontText) {
        throw new BadRequestException("frontText is required for text type");
      }
      frontText = createFlashcardDto.frontText;
    }

    if (createFlashcardDto.type === "image") {
      if (!file) {
        throw new BadRequestException("Image file is required for image type");
      }
      const uploaded = await this.cloudinaryService.uploadImage(file);
      frontImageUrl = uploaded.secure_url;
    }

    const created = new this.flashcardModel({
      type: createFlashcardDto.type,
      frontText,
      frontImage: frontImageUrl,
      back: createFlashcardDto.back,
      example: createFlashcardDto.example ?? null,
      tags: createFlashcardDto.tags ?? [],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return await this.flashcardModel.create(created);
  }

  async remove(id: string, user: IUser) {
    const flashcard = await this.flashcardModel.findById(id);
    if (!flashcard) {
      throw new BadRequestException("Flashcard not found");
    }

    if (flashcard.type === "image" && flashcard.frontImage) {
      // get public_id from url frontImage  to remove in cloudinary
      const publicId = extractPublicIdFromUrl(flashcard.frontImage);
      if (publicId) {
        const deleteResult = await this.cloudinaryService.deleteImage(publicId);
        console.log("Delete result:", deleteResult);
      }
    }

    const deleted = await this.flashcardModel.softDelete({ _id: id });

    await this.flashcardModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return deleted;
  }
}
