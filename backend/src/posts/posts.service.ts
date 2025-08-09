import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post, PostDocument } from "./schemas/post.schema";
import { InjectModel, Schema } from "@nestjs/mongoose";
import * as softDeletePluginMongoose from "soft-delete-plugin-mongoose";
import mongoose from "mongoose";
import type { IUser } from "src/interfaces/user.interface";

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name)
    private readonly postModel: softDeletePluginMongoose.SoftDeleteModel<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, user: IUser) {
    try {
      const createData = {
        ...createPostDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      };
      const post = await this.postModel.create(createData);
      console.log("Check create: ", post);
      return post;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll() {
    try {
      const postList = await this.postModel.find().sort({ createdAt: -1 });
      return postList;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postModel.findById({ _id: id });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return post;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) {
        throw error; // giữ nguyên 404
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(_id: string, updatePostDto: UpdatePostDto, user: IUser) {
    try {
      // check valid id
      const isValid = mongoose.Types.ObjectId.isValid(_id);
      if (!isValid) {
        throw new NotFoundException(`Post with ID ${_id} not found`);
      }
      const updatedPost = await this.postModel.updateOne(
        { _id },
        {
          title: updatePostDto.title,
          content: updatePostDto.content,
          meaning: updatePostDto?.meaning,
          // imageUrl: updatePostDto?.imageUrl,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        { new: true },
      );
      if (!updatedPost) {
        throw new NotFoundException(`Post with ID ${_id} not found`);
      }
      return updatedPost;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) {
        throw error; // giữ nguyên 404
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(_id: string, user) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(_id);
      if (!isValid) {
        throw new NotFoundException(`Post with ID ${_id} not found`);
      }
      const deleted = await this.postModel.softDelete({ _id });

      // update user who deleted is post
      await this.postModel.updateOne({
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return deleted;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotFoundException) {
        throw error; // giữ nguyên 404
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
