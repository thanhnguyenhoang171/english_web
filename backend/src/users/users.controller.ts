import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResponseMessage } from "src/decorator/response-message";
import { Roles } from "src/decorator/roles.decorator";
import { RolesGuard } from "src/authorization/roles.guard";
import { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @ResponseMessage("Create user successful")
  // createNewUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.registerNewUser(createUserDto);
  // }

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ResponseMessage("Fetch a user by email successfully")
  findUserByEmail(@Body("email") email: string) {
    return this.usersService.findByEmail(email);
  }

  // Update user infor -- user side
  @Patch(":id")
  @ResponseMessage("Update a user info successfully")
  updateUserInfo(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.updateUserInfo(id, updateUserDto, user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ResponseMessage("Get all user info sucessfully")
  getAllUserInfo() {
    return this.usersService.getAllUsers();
  }
}
