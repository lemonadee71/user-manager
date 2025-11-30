import fs from 'fs/promises';
import { z } from 'zod';

interface JsonTableOptions<T extends z.ZodObject> {
  filePath: string;
  schema: T;
}

type WhereFilter<T extends z.ZodObject> =
  | Partial<z.infer<T>>
  | ((row: z.infer<T>) => boolean);

interface GetOptions<T extends z.ZodObject> {
  where: WhereFilter<T>;
}

interface UpdateOptions<T extends z.ZodObject> {
  set: Partial<z.infer<T>>;
  where: WhereFilter<T>;
}

export default class JsonTable<T extends z.ZodObject> {
  private filePath: string;
  private schema: T;
  private data: z.infer<T>[] = [];

  constructor(options: JsonTableOptions<T>) {
    this.filePath = options.filePath;
    this.schema = options.schema;
  }

  /**
   * Check if given row matches the filter
   * @param row
   * @param filter
   * @returns true if match, false otherwise
   */
  private executeFilter(row: z.infer<T>, filter: WhereFilter<T>): boolean {
    if (typeof filter === 'function') {
      return filter(row);
    }

    return Object.keys(filter).every((key) => row[key] === filter[key]);
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

    return this.data.filter((row) => this.executeFilter(row, options.where));
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

  /**
   * Update rows from table
   *
   * @param options the filter and the update
   * @returns the updated rows
   */
  public async update(options: UpdateOptions<T>): Promise<z.infer<T>[]> {
    await this.load();

    const rows: z.infer<T>[] = [];

    this.data.forEach((row) => {
      const isMatch = this.executeFilter(row, options.where);

      if (isMatch) {
        // in place editing
        // ? there's probably a better option
        for (const key in options.set) {
          row[key] = options.set[key]!;
        }

        rows.push(row);
      }
    });

    await this.save();

    return rows;
  }
}
