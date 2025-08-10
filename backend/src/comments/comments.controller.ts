import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Public } from "src/decorator/auth-guard";
import { ResponseMessage } from "src/decorator/response-message";
import { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";

@Controller("posts/:postId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ResponseMessage("Create a new comment successfully")
  create(
    @Param("postId") postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: IUser,
  ) {
    return this.commentsService.create(postId, createCommentDto, user);
  }

  @Get()
  @ResponseMessage("Get all comments of a post successfully")
  findAllPostComment(@Param("postId") postId: string) {
    return this.commentsService.findAllPostComment(postId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.commentsService.remove(+id);
  }
}
