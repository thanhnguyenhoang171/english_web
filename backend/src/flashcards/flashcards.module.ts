import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { FlashcardsService } from "./flashcards.service";
import { FlashcardsController } from "./flashcards.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Flashcard, FlashcardSchema } from "./schemas/flashcard.schema";

import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
