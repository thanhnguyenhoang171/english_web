import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { IUser } from "src/interfaces/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import * as softDeletePluginMongoose from "soft-delete-plugin-mongoose";
import { Post, PostDocument } from "src/posts/schemas/post.schema";
import mongoose, { Schema } from "mongoose";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: softDeletePluginMongoose.SoftDeleteModel<CommentDocument>,
    @InjectModel(Post.name)
    private postModel: softDeletePluginMongoose.SoftDeleteModel<PostDocument>,
  ) {}

  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    user: IUser,
  ) {
    try {
      const post = await this.postModel.findById({ _id: postId });
      if (!mongoose.Types.ObjectId.isValid(postId) || !post) {
        throw new NotFoundException("Not found this post or post id");
      }

      const createData = {
        postId: postId,
        content: createCommentDto.content,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      };
      const comment = await this.commentModel.create(createData);
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllPostComment(postId: string) {
    try {
      const post = await this.postModel.findById({ _id: postId });
      if (!mongoose.Types.ObjectId.isValid(postId) || !post) {
        throw new NotFoundException("Not found this post or post id");
      }
      const comments = await this.commentModel.find({ postId });
      return comments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
