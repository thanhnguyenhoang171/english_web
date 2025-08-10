import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateFlashcardDto } from "./create-flashcard.dto";
import { IsOptional } from "class-validator";

export class UpdateFlashcardDto extends PartialType(
  OmitType(CreateFlashcardDto, ["type"] as const),
) {}
