import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsOptional()
  @IsNumber({}, { message: "Age must be a number" })
  age: number;

  @IsOptional()
  @IsString({ message: "Gender must be a string" })
  gender: string;

  @IsOptional()
  address: string;

  @IsOptional()
  role: string;

  @IsOptional()
  permissions: string[];
}
export enum RoleEnum {
  Student = "student",
  Teacher = "teacher",
  Admin = "admin",
}
export class RegisterUserDto {
  @IsNotEmpty({ message: "Name không được để trống" })
  name: string;

  @IsEmail({}, { message: "Email không đúng định dạng" })
  @IsNotEmpty({ message: "Email không được để trống" })
  email: string;

  @IsNotEmpty({ message: "Password không được để trống" })
  password: string;

  @IsNotEmpty({ message: "Age không được để trống" })
  age: number;

  @IsNotEmpty({ message: "Gender không được để trống" })
  gender: string;

  @IsNotEmpty({ message: "Address không được để trống" })
  address: string;

  @IsNotEmpty({ message: "confirmPassword không được để trống" })
  confirmPassword: string;
}
