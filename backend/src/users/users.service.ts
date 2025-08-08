import { Injectable } from "@nestjs/common";
import {
  CreateUserDto,
  RegisterUserDto,
  RoleEnum,
} from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";

import { hashPassword } from "src/utils/password-hasing";
import { compareSync } from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createNewUser(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async registerNewUser(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;

    // Check email exist ?
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    // Check confirm password
    if (password !== user.confirmPassword) {
      throw new Error("Passwords do not match");
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

  findUserByToken(token: string) {
    return this.userModel.findOne({ refreshToken: token });
  }
}
