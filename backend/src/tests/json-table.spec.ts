import fs from 'fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import JsonTable from '../lib/json-table.js';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/tests', 'user.test.json');
const UsersSchema = z.object({
  id: z.number().positive().min(1),
  name: z.string().trim().min(1),
});

describe('JsonTable', () => {
  beforeEach(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  afterEach(() => {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  it('creates file if not created yet', async () => {
    const Users = new JsonTable({
      filePath,
      schema: UsersSchema,
    });

    await Users.init();

    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('inserts row', async () => {
    const Users = new JsonTable({ filePath, schema: UsersSchema });

    await Users.init();

    const row = { id: 1, name: 'TEST' };

    await Users.insert(row);

    // eslint-disable-next-line
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // eslint-disable-next-line
    expect(data[0]).toEqual(row);
  });

  it('throws validation error on insert', async () => {
    const Users = new JsonTable({ filePath, schema: UsersSchema });

    await Users.init();

    const row = { id: 'test', name: 'TEST' };

    // @ts-expect-error test only
    await expect(Users.insert(row)).rejects.toThrow();
  });

  it('inserts multiple rows', async () => {
    const Users = new JsonTable({ filePath, schema: UsersSchema });

    await Users.init();

    await Users.insert([
      {
        id: 1,
        name: 'First',
      },
      {
        id: 2,
        name: 'Second',
      },
    ]);

    // eslint-disable-next-line
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // eslint-disable-next-line
    expect(data.length).toBe(2);
  });
});
