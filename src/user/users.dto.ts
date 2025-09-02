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
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
// utils/types.ts or common/types.ts
import { FilterQuery } from 'mongoose';

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

  @ApiProperty()
  role: 'user' | 'admin';

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

export class QueryParamsDto {
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by status (e.g., active)' })
  @IsOptional()
  @IsString()
  status?: string[];

  @ApiPropertyOptional({ description: 'Filter by role (e.g., admin, user)' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional({ description: 'Sort field', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;
}

export type MongooseFilter<T> = FilterQuery<T>;

export interface PagedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
}
