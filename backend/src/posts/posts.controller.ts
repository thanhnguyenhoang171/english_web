import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Public } from "src/decorator/auth-guard";
import { ResponseMessage } from "src/decorator/response-message";
import { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage("Create a post successfully")
  create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch post list successfully")
  findAll() {
    return this.postsService.findAll();
  }

  @Get(":id")
  @Public()
  @ResponseMessage("Fetch a post by id successfully")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(":id")
  // @Public()
  @ResponseMessage("Update a post successfully")
  update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: IUser,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a post successfully")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.postsService.remove(id, user);
  }
}
