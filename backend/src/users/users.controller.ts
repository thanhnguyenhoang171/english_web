import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResponseMessage } from "src/decorator/response-message";
import { Roles } from "src/decorator/roles.decorator";
import { RolesGuard } from "src/authorization/roles.guard";

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
  @Roles("student")
  findUserByEmail(@Body("email") email: string) {
    return this.usersService.findByEmail(email);
  }
}
