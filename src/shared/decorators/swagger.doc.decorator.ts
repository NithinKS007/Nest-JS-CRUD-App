import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { SignInDto, SignInResDto, SignUpDto, SignUpResDto } from 'src/user/users.dto';

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
}

export function SwaggerDoc(options: SwaggerDocOptions) {
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

  (options.errors || []).forEach((error) => {
    switch (error.status) {
      case 400:
        decorators.push(ApiBadRequestResponse({ description: error.description }));
        break;
      case 401:
        decorators.push(ApiUnauthorizedResponse({ description: error.description }));
        break;
      case 404:
        decorators.push(ApiNotFoundResponse({ description: error.description }));
        break;
      case 409:
        decorators.push(ApiConflictResponse({ description: error.description }));
        break;
      default:
        decorators.push(ApiResponse({ status: error.status, description: error.description }));
    }
  });

  return applyDecorators(...decorators);
}

export function SignInSwaggerDoc() {
  return SwaggerDoc({
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
}

export function SignUpSwaggerDoc() {
  return SwaggerDoc({
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
}


