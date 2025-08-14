import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import cookieParser from "cookie-parser";
import { JwtAuthGuard } from "./authentication/jwt-auth.guard";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("PORT") || 3001;
  const HOST = configService.get<string>("HOST");

  // Define global interceptors and pipes
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useGlobalPipes(new ValidationPipe());

  // upload file
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

  //config cookies
  app.use(cookieParser());

  // api versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix("api");

  //config cors
  app.enableCors({
    origin: [
    'http://localhost:5173', // local dev
    'https://english-rkhc46krq-thane-nguyens-projects.vercel.app', // vercel domain
  ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  });

  await app.listen(PORT);
  console.log(`Server is running on http://${HOST}:${PORT}`);
}

void bootstrap();
