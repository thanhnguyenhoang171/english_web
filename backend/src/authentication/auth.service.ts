import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { IUser } from "src/interfaces/user.interface";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import ms from "ms";
import { access } from "fs";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isValidPassword = this.usersService.isValidPassword(
      pass,
      user.password,
    );

    if (isValidPassword === true) {
      // Convert Mongoose document to plain object
      const userObj = user.toObject();

      const { password, ...result } = userObj;

      return result;
    }

    return null;
  }

  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.registerNewUser(user);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: "token_login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };

    // Sign refresh token
    const refresh_token = this.createRefreshToken(payload);

    // Update user refresh token in database
    await this.usersService.updateRefreshToken(_id, refresh_token);

    // Set refresh token in cookie
    response.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge:
        ms(this.configService.get<string>("JWT_EXPIRATION") || "1h") / 1000,
    });
    // Sign access token
    return {
      access_token: this.jwtService.sign(payload),
      // user format data after login
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn:
        ms(this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME")) /
        1000,
    });
    return refresh_token;
  };

  processNewAccessToken = async (refreshToken: string, response: Response) => {
    try {
      // Verify the refresh token
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });

      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: "token refresh",
          iss: "from server",
          _id,
          name,
          email,
          role,
        };

        // sign again refresh token
        const new_refresh_token = this.createRefreshToken(payload);

        // update user refresh token in database
        await this.usersService.updateRefreshToken(
          _id.toString(),
          new_refresh_token,
        );

        // Clear old refresh token in cookie
        response.clearCookie("refresh_token");

        // Set new refresh token in cookie
        response.cookie("refresh_token", new_refresh_token, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME")) /
            1000,
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  };
}
