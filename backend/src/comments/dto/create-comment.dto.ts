import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty({ message: "Comment is required" })
  @IsString()
  content: string;
}
