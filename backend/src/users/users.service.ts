import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateUserDto,
  RegisterUserDto,
  RoleEnum,
} from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";

import { hashPassword } from "src/utils/password-hasing";
import { compareSync } from "bcrypt";
import * as softDeletePluginMongoose from "soft-delete-plugin-mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "src/interfaces/user.interface";
import mongoose from "mongoose";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: softDeletePluginMongoose.SoftDeleteModel<UserDocument>,
  ) {}

  async createNewUser(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);

    return user;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async registerNewUser(user: RegisterUserDto) {
    try {
      const { name, email, password, age, gender, address } = user;

      // Check email exist ?
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException("Email already exists");
      }
      // Check confirm password
      if (password !== user.confirmPassword) {
        throw new BadRequestException("Passwords do not match");
      }
      // hashing password
      const hashedPassword = await hashPassword(password);

      // store in db
      const newUserRegister = await this.userModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        age: age,
        gender: gender,
        address: address,
        role: RoleEnum.Student,
      });
      console.log("New user registered:", newUserRegister);
      return newUserRegister;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateRefreshToken(_id: string, refreshToken: string) {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken: refreshToken },
    );
  }

  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  findUserByToken(refreshToken: string) {
    return this.userModel.findOne({ refreshToken });
  }

  async updateUserInfo(_id: string, updateUserDto: UpdateUserDto, user: IUser) {
    try {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new BadRequestException("Invalid userID");
      }
      const userExist = await this.userModel.findById({ _id });
      if (!userExist) {
        throw new NotFoundException("User not found");
      }
      if (
        user._id !== userExist.createdBy._id.toString() &&
        user.role.toString() !== "admin"
      ) {
        throw new ForbiddenException("You are not allow to modify this user");
      }
      const updateData = {
        name: updateUserDto.name,
        email: updateUserDto.email,
        age: updateUserDto.age,
        gender: updateUserDto.gender,
        address: updateUserDto.address,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      };
      const updated = await this.userModel.updateOne({ _id }, updateData);
      return updated;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllUsers() {
    return await this.userModel.find().sort({ createdAt: -1 });
  }

  updateUserToken = async (_id: string, refreshToken: string ) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };
}
