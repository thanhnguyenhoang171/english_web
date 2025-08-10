import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateFlashcardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashcardDto } from "./dto/update-flashcard.dto";
import { IUser } from "src/interfaces/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Flashcard, FlashcardDocument } from "./schemas/flashcard.schema";
import * as softDeletePluginMongoose from "soft-delete-plugin-mongoose";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { extractPublicIdFromUrl } from "src/utils/extract-public-id-from-url";
import mongoose from "mongoose";
import { Multer } from "multer";

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

  async remove(_id: string, user: IUser) {
    const flashcard = await this.flashcardModel.findById(_id);
    if (!flashcard) {
      throw new BadRequestException("Flashcard not found");
    }

    if (flashcard.type === "image" && flashcard.frontImage) {
      await this.removeImgFromCloudinary(_id, flashcard.frontImage);
    }

    const deleted = await this.flashcardModel.softDelete({ _id });

    await this.flashcardModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return deleted;
  }

  async getAll() {
    try {
      const flashcards = await this.flashcardModel.find();
      return flashcards;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getById(_id: string) {
    try {
      // check valid mongo ObjectID
      const isValid = mongoose.Types.ObjectId.isValid(_id);
      if (!isValid) {
        throw new NotFoundException(`Flashcard with ID ${_id} not found`);
      }
      const flashcard = await this.flashcardModel.findById(_id);
      return flashcard;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    _id: string,
    updateFlashcardDto: UpdateFlashcardDto,
    user: IUser,
    file?: Express.Multer.File,
  ) {
    try {
      // Check valid mongo id
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new NotFoundException(`Flashcard with ID ${_id} not found`);
      }
      const flashcard = await this.flashcardModel.findById(_id);
      if (!flashcard) {
        throw new NotFoundException(`Flashcard with ID ${_id} not found`);
      }

      const typeFlashcard = flashcard.type;
      let updateData: any = {
        back: updateFlashcardDto.back ?? flashcard.back,
        example: updateFlashcardDto.example ?? flashcard.example,
        tags: updateFlashcardDto.tags ?? flashcard.tags,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      };

      if (typeFlashcard === "text") {
        updateData.frontText =
          updateFlashcardDto.frontText ?? flashcard.frontText;
      } else if (typeFlashcard === "image") {
        // upload + xóa ảnh cũ
        if (file) {
          // Xóa ảnh cũ sau
          if (flashcard.frontImage) {
            await this.removeImgFromCloudinary(_id, flashcard.frontImage);
          }

          const uploaded = await this.cloudinaryService.uploadImage(file);

          updateData.frontImage = uploaded.secure_url;
        } else {
          //  giữ nguyên ảnh cũ
          updateData.frontImage = flashcard.frontImage;
        }
      }

      // Update new flash card
      const updatedFlashcard = await this.flashcardModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true },
      );

      return updatedFlashcard;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeImgFromCloudinary(_id: string, frontImage: string) {
    // get public_id from url frontImage to remove in cloudinary
    const publicId = extractPublicIdFromUrl(frontImage);

    if (!publicId) {
      console.warn(`Invalid Cloudinary public ID for flashcard ${_id}`);
      return;
    }

    try {
      const deleteResult = await this.cloudinaryService.deleteImage(publicId);

      //  { result: 'ok' } success
      if (deleteResult?.result === "ok") {
        await this.flashcardModel.updateOne({ _id }, { frontImage: null });
      } else {
        console.warn(
          `Failed to delete image from Cloudinary for flashcard ${_id}: ${JSON.stringify(deleteResult)}`,
        );
      }
    } catch (error) {
      console.error(
        `Error deleting image from Cloudinary for flashcard ${_id}:`,
        error,
      );
    }
  }
}
