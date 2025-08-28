import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  SignInDto,
  SignInResDto,
  SignUpDto,
  SignUpResDto,
  UserResDto,
} from 'src/user/users.dto';

type ErrorResponse = {
  status: number;
  description: string;
};

interface SwaggerDocOptions {
  summary: string;
  body?: Type<unknown>;
  response: {
    status: number;
    description: string;
    type: Type<unknown>;
  };
  errors?: ErrorResponse[];
  bearerAuth?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';

export class CustomApiResponse<T> {
  @ApiProperty()
  success?: boolean;

  @ApiProperty()
  statusCode?: number;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty()
  data: T;
}

export const SwaggerDoc = (options: SwaggerDocOptions) => {
  const decorators = [
    ApiOperation({ summary: options.summary }),
    ApiResponse({
      status: options.response.status,
      description: options.response.description,
      type: options.response.type,
    }),
  ];

  if (options.body) {
    decorators.push(ApiBody({ type: options.body }));
  }

  if (options.bearerAuth) {
    decorators.push(ApiBearerAuth('accesstoken'));
  }

  (options.errors || []).forEach((error) => {
    switch (error.status) {
      case 400:
        decorators.push(
          ApiBadRequestResponse({ description: error.description }),
        );
        break;
      case 401:
        decorators.push(
          ApiUnauthorizedResponse({ description: error.description }),
        );
        break;
      case 404:
        decorators.push(
          ApiNotFoundResponse({ description: error.description }),
        );
        break;
      case 409:
        decorators.push(
          ApiConflictResponse({ description: error.description }),
        );
        break;
      default:
        decorators.push(
          ApiResponse({ status: error.status, description: error.description }),
        );
    }
  });

  return applyDecorators(...decorators);
};

export const SignInSwaggerDoc = () =>
  SwaggerDoc({
    summary: 'Sign in user and return token',
    body: SignInDto,
    response: {
      status: 200,
      description: 'Login successful',
      type: SignInResDto,
    },
    errors: [
      { status: 400, description: 'Invalid input' },
      { status: 401, description: 'Invalid password or user is blocked' },
      { status: 404, description: 'Email not found' },
    ],
  });

export const SignUpSwaggerDoc = () =>
  SwaggerDoc({
    summary: 'Register a new user',
    body: SignUpDto,
    response: {
      status: 201,
      description: 'User created successfully',
      type: SignUpResDto,
    },
    errors: [
      { status: 400, description: 'Invalid input' },
      { status: 409, description: 'Email already exists' },
    ],
  });

export const FindUserByIdDoc = () =>
  SwaggerDoc({
    summary: 'Fetch user by ID',
    response: {
      status: 200,
      description: 'User details fetched successfully.',
      type: UserResDto,
    },
    bearerAuth: true,
    errors: [{ status: 404, description: 'User not found' }],
  });
