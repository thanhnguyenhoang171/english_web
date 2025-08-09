import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

export class CreateFlashcardDto {
  @IsEnum(["text", "image"])
  type: "text" | "image";

  @ValidateIf((o) => o.type === "text")
  @IsNotEmpty()
  @IsString()
  frontText?: string;

  @ValidateIf((o) => o.type === "image")
  @IsOptional()
  frontImage?: string;

  @IsNotEmpty()
  @IsString()
  back: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  tags?: string[];
}
