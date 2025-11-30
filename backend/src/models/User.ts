import path from 'path';
import { z } from 'zod';
import JsonTable from '../lib/json-table.js';

export const UserSchema = z.object({
  id: z.number().positive().min(1),
  name: z.string().trim().max(52),
  username: z
    .stringFormat('username', /^[a-zA-Z0-9_-]+$/, 'Must be a valid username')
    .min(3)
    .max(24),
  email: z.email().trim(),
});

export type InsertUser = z.infer<typeof UserSchema>;
export type UpdateUser = Partial<z.infer<typeof UserSchema>>;

export const UserModel = new JsonTable({
  filePath: path.join(process.cwd(), 'db', 'user.json'),
  schema: UserSchema,
});
