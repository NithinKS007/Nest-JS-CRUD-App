import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsUrl,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  fName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lName: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsString()
  @IsUrl()
  image: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Type(() => Boolean)
  @IsBoolean()
  isBlocked: boolean;

  @IsEnum(UserRole, {
    message: `role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}

export class SignUpDto extends UserDto {}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

