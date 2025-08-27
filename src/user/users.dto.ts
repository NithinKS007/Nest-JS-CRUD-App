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

export enum UserRole {
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

export class SignUpDto {
  @ApiProperty()
  fName: string;

  @ApiProperty()
  lName: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class SignInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UserResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fName: string;

  @ApiProperty()
  lName: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isBlocked: boolean;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Timestamp when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Timestamp when the user was last updated',
  })
  updatedAt: Date;
}

export class SignUpResDto {
  @ApiProperty({ type: () => UserResDto })
  user: UserResDto;
}

export class SignInResDto {
  @ApiProperty({ type: () => UserResDto })
  user: UserResDto;

  @ApiProperty()
  accessToken: string;
}
