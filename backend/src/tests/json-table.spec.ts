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

  it('gets all rows', async () => {
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

    const rows = await Users.get();

    expect(rows.length).toBe(2);
  });

  it('gets single row', async () => {
    const Users = new JsonTable({ filePath, schema: UsersSchema });

    await Users.init();

    const firstRow = {
      id: 1,
      name: 'First',
    };

    await Users.insert([
      firstRow,
      {
        id: 2,
        name: 'Second',
      },
    ]);

    const row = await Users.first({
      where: (row) => typeof row.name === 'string',
    });

    expect(row).toEqual(firstRow);
  });

  it('gets rows based on custom filter', async () => {
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
      {
        id: 3,
        name: 'Second',
      },
    ]);

    const rows = await Users.get({
      where: (row) => row.id === 1 || row.id === 3,
    });

    expect(rows.length).toBe(2);
    expect(rows.map((row) => row.id)).toEqual([1, 3]);
  });

  it('updates row', async () => {
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

    await Users.update({
      set: {
        id: 3,
        name: 'Third',
      },
      where: { id: 1 },
    });

    const originalRow = await Users.first({ where: { id: 1 } });
    const rows = await Users.get();

    expect(originalRow).toBeUndefined();
    expect(rows.map((row) => row.id)).toEqual([3, 2]);
  });

  it('updates multiple rows', async () => {
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
      {
        id: 3,
        name: 'Third',
      },
    ]);

    await Users.update({
      set: {
        name: 'TEST',
      },
      where(row) {
        return row.id > 1;
      },
    });

    const rows = await Users.get();

    expect(rows).toEqual([
      {
        id: 1,
        name: 'First',
      },
      {
        id: 2,
        name: 'TEST',
      },
      {
        id: 3,
        name: 'TEST',
      },
    ]);
  });
});
