import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
      maxAge: ms(
        this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME") || "1h",
      ),
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
      expiresIn: ms(
        this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME"),
      ),
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });
      let user = await this.usersService.findUserByToken(refreshToken);
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

        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(_id.toString(), refresh_token);

        // //set refresh_token as cookies
        // response.clearCookie("refresh_token");

        response.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          maxAge: ms(
            this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME"),
          ),
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
      } else {
        throw new BadRequestException(
          `Refresh token không hợp lệ. Vui lòng login.`,
        );
      }
    } catch (error) {
      console.error("Verify error:", error);
      throw new BadRequestException(
        `Refresh token không hợp lệ. Vui lòng login.`,
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken(user._id, "");
    response.clearCookie("refresh_token");
    return "ok";
  };
}
