import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Public } from "src/decorator/auth-guard";
import { ResponseMessage } from "src/decorator/response-message";
import { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";

@Controller("posts")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get("comments/owner")
  @ResponseMessage("Fetch all flashcards successfully")
  async fetchAllOwnerComment(@User() user: IUser) {
    return await this.commentsService.getAllOwnerComment(user);
  }
  @Post(":postId/comments")
  @ResponseMessage("Create a new comment successfully")
  async create(
    @Param("postId") postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.create(postId, createCommentDto, user);
  }

  @Get(":postId/comments")
  @Public()
  @ResponseMessage("Get all comments of a post successfully")
  async indAllPostComment(@Param("postId") postId: string) {
    return await this.commentsService.findAllPostComment(postId);
  }

  @Patch("/comments/:commentId")
  @ResponseMessage("Update a comment of a post successfully")
  async updateComment(
    @Param("commentId") commentId: string,
    @Body() updateDto: UpdateCommentDto,
    @User() user: IUser,
  ) {
    return await this.commentsService.updateComment(
      commentId,

      updateDto,
      user,
    );
  }

  @Delete("/comments/:commentId")
  @ResponseMessage("Delete a comment successfully")
  async delete(@Param("commentId") commentId: string, @User() user: IUser) {
    return await this.commentsService.deleteComment(commentId, user);
  }
}
