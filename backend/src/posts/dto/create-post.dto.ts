import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @IsNotEmpty({ message: "Content is required" })
  content: string;

  @IsOptional()
  meaning: string;

  @IsOptional()
  flashcards: string[];
}
