import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string('Name is required').trim().min(4).max(52),
  username: z
    .stringFormat(
      'username',
      /^[a-zA-Z0-9_-]+$/,
      'Only alphanumeric characters, _, and - are allowed',
    )
    .min(3)
    .max(24),
  email: z.email('Email is required').trim(),
});
