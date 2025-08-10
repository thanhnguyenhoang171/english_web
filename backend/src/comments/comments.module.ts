import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { Post, PostSchema } from "src/posts/schemas/post.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
