import fs from 'fs/promises';
import { z } from 'zod';

interface JsonTableOptions<T extends z.ZodObject> {
  filePath: string;
  schema: T;
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

  public async insert(data: z.input<typeof this.schema>) {
    await this.load();
    const row = this.schema.parse(data);

    this.data.push(row);
    await this.save();
    return row;
  }
}
