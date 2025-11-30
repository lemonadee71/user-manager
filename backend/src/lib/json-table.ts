import fs from 'fs/promises';
import { z } from 'zod';

interface JsonTableOptions<T extends z.ZodObject> {
  filePath: string;
  schema: T;
}

interface GetOptions<T extends z.ZodObject> {
  where: Partial<z.infer<T>> | ((row: z.infer<T>) => boolean);
}

export default class JsonTable<T extends z.ZodObject> {
  private filePath: string;
  private schema: T;
  private data: z.infer<T>[] = [];

  constructor(options: JsonTableOptions<T>) {
    this.filePath = options.filePath;
    this.schema = options.schema;
  }

  public async init() {
    await this.load();
  }

  private async load() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      // eslint-disable-next-line
      this.data = JSON.parse(data);
    } catch {
      this.data = [];
      await this.save();
    }
  }

  private async save() {
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }

  public async insert(data: z.infer<T>): Promise<z.infer<T>>;
  public async insert(data: z.infer<T>[]): Promise<z.infer<T>[]>;
  public async insert(data: z.infer<T> | z.infer<T>[]) {
    await this.load();

    if (Array.isArray(data)) {
      const rows = data.map((info) => this.schema.parse(info));
      this.data.push(...rows);
      await this.save();
      return rows;
    }

    const row = this.schema.parse(data);
    this.data.push(row);
    await this.save();

    return row;
  }

  /**
   * Get rows from table
   *
   * @param options the filter; undefined to get all
   * @returns the matching rows; undefined if nothing matches
   */
  public async get(options?: GetOptions<T>): Promise<z.infer<T>[]> {
    await this.load();

    if (!options) return this.data;

    if (typeof options.where === 'function') {
      return this.data.filter(options.where);
    }

    const keys = Object.keys(options.where) as (keyof z.infer<T>)[];

    return this.data.filter((row) => {
      // @ts-expect-error won't equal
      return keys.every((key) => row[key] === options.where[key]);
    });
  }

  /**
   * Get row from table
   *
   * @param options the filter
   * @returns the first matching row; undefined if nothing matches
   */
  public async first(options: GetOptions<T>): Promise<z.infer<T>> {
    const rows = await this.get(options);
    return rows[0];
  }
}
