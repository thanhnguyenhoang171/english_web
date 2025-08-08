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
  @Post("register")
  async handleRegister(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }
  @Public()
  @ResponseMessage("Get user by refresh token successful")
  @Get("refresh")
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies["refresh_token"];
    return this.authService.processNewAccessToken(refreshToken, response);
  }
}
