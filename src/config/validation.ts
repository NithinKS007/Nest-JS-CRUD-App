import * as Joi from 'joi';

export const validationSchema = Joi.object({
  COMPASS_DATABASE_CONFIG: Joi.string().uri().required(),

  PORT: Joi.number().default(3000),

  MODE: Joi.string()
    .valid('DEVELOPMENT', 'PRODUCTION')
    .default('DEVELOPMENT'),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().default('15m'),

  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),
});
