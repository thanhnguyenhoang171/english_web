import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type FlashcardDocument = HydratedDocument<Flashcard>;

@Schema({ timestamps: true })
export class Flashcard {
  @Prop({ type: String, enum: ["text", "image"], required: true })
  type: "text" | "image";
  @Prop({ type: String })
  frontText: string;

  @Prop({ type: String })
  frontImage: string;

  @Prop({ type: String, required: true })
  back: string;

  @Prop()
  example: string;

  @Prop({ type: [String] })
  tags: [string];

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
