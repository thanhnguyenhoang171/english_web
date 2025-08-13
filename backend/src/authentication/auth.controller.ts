import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import { ResponseMessage } from "src/decorator/response-message";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public } from "src/decorator/auth-guard";
import { User } from "src/decorator/IUser-decorator";
import type { IUser } from "src/interfaces/user.interface";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @ResponseMessage("User Login")
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    console.log("USER LOGIN:", req.user);
    return this.authService.login(req.user, response); // req.user được LocalStrategy xử lý
  }

  @Public()
  @ResponseMessage("Register user successful")
  @Post("/register")
  async handleRegister(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }

  @Public()
  @ResponseMessage("Get user by refresh token successful")
  @Get("/refresh")
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies["refresh_token"];
    console.log("Check refresh token = ", refreshToken);
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage("Get user information")
  @Get("/account")
  async handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @ResponseMessage("Logout User")
  @Post("/logout")
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
