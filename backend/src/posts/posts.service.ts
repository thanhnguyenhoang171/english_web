import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post, PostDocument } from "./schemas/post.schema";
import { InjectModel, Schema } from "@nestjs/mongoose";
import * as softDeletePluginMongoose from "soft-delete-plugin-mongoose";
import mongoose, { Types } from "mongoose";
import type { IUser } from "src/interfaces/user.interface";

let aqp;

async function getAqp() {
  if (!aqp) {
    const mod = await import("api-query-params");
    aqp = mod.default;
  }
  return aqp;
}

@Injectable()
export class PostsService {
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

      return post;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll() {
    try {
      const postList = await this.postModel.find().sort({ createdAt: -1 });
      return postList;
    } catch (error) {
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
        throw new BadRequestException(`Post with ID ${_id} not found`);
      }
      // Check exist post
      const post = await this.postModel.findById({ _id });
      if (!post) {
        throw new NotFoundException("Post can not found");
      }

      // Check owner
      if (
        user._id !== post.createdBy._id.toString() &&
        user.role.toString() !== "admin"
      ) {
        throw new ForbiddenException("You are now allow to modify this post");
      }
      const updatedPost = await this.postModel.updateOne(
        { _id },
        {
          title: updatePostDto.title,
          content: updatePostDto.content,
          meaning: updatePostDto?.meaning,
          flashcards: updatePostDto.flashcards,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        { new: true },
      );
      return updatedPost;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(_id: string, user) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(_id);
      if (!isValid) {
        throw new BadRequestException(`Post with ID ${_id} not found`);
      }
      // Check exist post
      const post = await this.postModel.findById({ _id });
      if (!post) {
        throw new NotFoundException("Post not  found");
      }

      // Check owner
      if (
        user._id !== post.createdBy._id.toString() &&
        user.role.toString() !== "admin"
      ) {
        throw new ForbiddenException("You are not allow to remove this post");
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
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
  async getAllPostOwner(user: IUser) {
    try {
      const posts = await this.postModel
        .find({
          "createdBy._id": user._id,
        })
        .sort({ createdAt: -1 });

      return posts;
    } catch (error) {
      throw new InternalServerErrorException("Server error");
    }
  }

  // get all post with pagination
  async getAllPosts(currentPage: number, limit: number, qs: string) {
    const aqp = await getAqp();

    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // console.log("filter:", filter);

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 5;

    const totalItems = await this.postModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.postModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort && Object.keys(sort).length > 0 ? sort : { createdAt: -1 })

      // flashcards
      .populate({
        path: "flashcards",
        select: "type frontText frontImage back example tags -_id", //hide  _id
      });

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: result,
    };
  }
}
