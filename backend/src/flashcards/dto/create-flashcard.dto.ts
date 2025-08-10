import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

export class CreateFlashcardDto {
  @IsOptional()
  @IsEnum(["text", "image"], {
    message: "type phải là 'text' hoặc 'image'",
  })
  type: "text" | "image";

  @ValidateIf((o) => o.type === "text")
  @IsNotEmpty({ message: "frontText không được để trống khi type là 'text'" })
  @IsString({ message: "frontText phải là chuỗi" })
  frontText?: string;

  @ValidateIf((o) => o.type === "image")
  @IsOptional()
  frontImage?: string;

  @IsNotEmpty({ message: "back không được để trống" })
  @IsOptional()
  @IsString({ message: "back phải là chuỗi" })
  back: string;

  @IsOptional()
  @IsString({ message: "example phải là chuỗi" })
  example?: string;

  @IsOptional()
  tags?: string[];
}
