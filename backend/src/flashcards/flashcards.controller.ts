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
  Res,
} from "@nestjs/common";
import { FlashcardsService } from "./flashcards.service";
import { CreateFlashcardDto } from "./dto/create-flashcard.dto";
import { UpdateFlashcardDto } from "./dto/update-flashcard.dto";
import { ResponseMessage } from "src/decorator/response-message";
import { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { ValidateImageInterceptor } from "src/interceptors/ValidateImageInterceptor";
import { Public } from "src/decorator/auth-guard";

@Controller("flashcards")
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  @ResponseMessage("Create a new flashcard successfully")
  @UseInterceptors(
    FileInterceptor("file"),
    ValidateImageInterceptor, // Chạy ngay sau multer xử lý file
  )
  async create(
    @Body() dto: CreateFlashcardDto,
    @User() user: IUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.flashcardsService.create(dto, user, file);
  }

  @Delete(":id")
  @ResponseMessage("Delete a flashcard successfully")
  async remove(@Param("id") id: string, @User() user: IUser) {
    return await this.flashcardsService.remove(id, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch all flashcards successfully")
  async fetchAll() {
    return await this.flashcardsService.getAll();
  }

  @Get(":id")
  @Public()
  @ResponseMessage("Fetch a flashcard by id successfully")
  async fetchById(@Param("id") id: string) {
    return await this.flashcardsService.getById(id);
  }

  @Patch(":id")
  @ResponseMessage("Update a flashcard successfully")
  @UseInterceptors(FileInterceptor("file"), ValidateImageInterceptor)
  async update(
    @Param("id") id: string,
    @Body() updateFlashcardDto: CreateFlashcardDto,
    @User() user: IUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.flashcardsService.update(id, updateFlashcardDto, user, file);
  }
}
