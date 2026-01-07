import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('notification', () => ({
  sendgridKey: process.env.SENDGRID_KEY,
  sendgridFrom: process.env.SENDGRID_FROM,
}));

export const notificationConfigValidation = Joi.object({
  SENDGRID_KEY: Joi.string().required(),
  SENDGRID_FROM: Joi.string().email().required(),
});
