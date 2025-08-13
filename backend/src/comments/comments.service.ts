import {
  BadRequestException,
  ForbiddenException,
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
      // check valid Id
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new BadRequestException("Invalid postId");
      }
      const post = await this.postModel.findById({ _id: postId });
      if (!post) {
        throw new NotFoundException("Not found this post");
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
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllPostComment(postId: string) {
    try {
      // check valid mongoId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new BadRequestException("Invalid postId");
      }
      const post = await this.postModel.findById({ _id: postId });
      if (!mongoose.Types.ObjectId.isValid(postId) || !post) {
        throw new NotFoundException("Not found this post or post id");
      }
      const comments = await this.commentModel
        .find({ postId })
        .sort({ createdAt: -1 });
      return comments;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateComment(
    commentId: string,
    updateDto: UpdateCommentDto,
    user: IUser,
  ) {
    // check comment owner

    try {
      // Check valid mongo objectID
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new BadRequestException("Invalid comment or post ID");
      }

      // check exist comment
      const comment = await this.commentModel.findById({ _id: commentId });
      if (!comment) {
        throw new NotFoundException("Comment with this ID not found");
      }
      // Check comment owner
      if (
        user._id !== comment.createdBy._id.toString() &&
        user.role.toString() !== "admin"
      ) {
        throw new ForbiddenException(
          "You are not allow to modify this comment",
        );
      }
      const updateComment = {
        content: updateDto.content,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      };
      const updated = await this.commentModel.updateOne(
        { _id: commentId },
        updateComment,
      );
      return updated;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Error Internal Server");
    }
  }

  async deleteComment(commentId: string, user: IUser) {
    try {
      //Check valid Id
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new BadRequestException("Invalid comment or post ID");
      }
      // check exist comment
      const comment = await this.commentModel.findById({ _id: commentId });

      // check onwer
      if (
        user._id !== comment?.createdBy._id.toString() &&
        user.role.toString() !== "admin"
      ) {
        throw new ForbiddenException(
          "You are not allow to delete this comment",
        );
      }
      if (!comment) {
        throw new NotFoundException("Comment with this ID not found");
      }

      // soft delete
      const deleted = await this.commentModel.softDelete({ _id: commentId });
      // update deleteBy user
      await this.commentModel.updateOne(
        { _id: user._id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
      return deleted;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Error internal server");
    }
  }

  async getAllOwnerComment(user: IUser) {
    try {
      const comments = await this.commentModel
        .find({
          "createdBy._id": user._id,
        })
        .sort({ createdAt: -1 });
      return comments;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
