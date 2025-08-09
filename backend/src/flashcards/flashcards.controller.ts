import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFile,
} from "@nestjs/common";
import { FlashcardsService } from "./flashcards.service";
import { CreateFlashcardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashcardDto } from "./dto/update-flashcard.dto";
import { ResponseMessage } from "src/decorator/response-message";
import  { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidateImageInterceptor } from "src/interceptors/ValidateImageInterceptor";

@Controller("flashcards")
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file"),
    ValidateImageInterceptor, // Chạy ngay sau multer xử lý file
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() dto: CreateFlashcardDto,
    @User() user: IUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.flashcardsService.create(dto, user, file);
  }

    @Delete(":id")
  async remove(@Param("id") id: string,@User() user: IUser) {


    return await this.flashcardsService.remove(id, user);
  }
}

