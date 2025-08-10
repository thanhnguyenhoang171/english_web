import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { UsersModule } from "./users/users.module";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { AuthModule } from "./authentication/auth.module";
import { PostsModule } from './posts/posts.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
        onConnectionCreate: (connection: Connection) => {
          connection.on("connected", () => console.log("connected"));
          connection.on("open", () => console.log("open"));
          connection.on("disconnected", () => console.log("disconnected"));
          connection.on("reconnected", () => console.log("reconnected"));
          connection.on("disconnecting", () => console.log("disconnecting"));

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    FlashcardsModule,
    CloudinaryModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
