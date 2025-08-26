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
import { ApiProperty } from '@nestjs/swagger';
import { OmitType, PickType } from '@nestjs/mapped-types';

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  fName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lName: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  image: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  isBlocked: boolean;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, {
    message: `role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}

export class SignUpDto extends PickType(UserDto, [
  'fName',
  'lName',
  'age',
  'image',
  'email',
  'password',
] as const) {}

export class SignInDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}

export class UserResDto extends OmitType(UserDto, ['password'] as const) {
  @ApiProperty()
  id: string;
}

export class SignUpResDto extends UserResDto {}

export class SignInResDto {
  @ApiProperty({ type: () => UserResDto })
  user: UserResDto;

  @ApiProperty()
  accessToken: string;
}
