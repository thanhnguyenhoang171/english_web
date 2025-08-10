import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Post } from "src/posts/schemas/post.schema";
import { User } from "src/users/schemas/user.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name,
    required: true,
  })
  postId: mongoose.Schema.Types.ObjectId;

  //   @Prop({
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: User.name,
  //     required: true,
  //   })
  //   userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Object }) // Look like ref to User
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
