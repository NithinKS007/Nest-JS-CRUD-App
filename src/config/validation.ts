import * as Joi from 'joi';

export const validationSchema = Joi.object({
  COMPASS_DATABASE_CONFIG: Joi.string().uri().required(),
  PORT: Joi.number(),
  MODE: Joi.string()
    .valid('DEVELOPMENT', 'PRODUCTION'),
});
