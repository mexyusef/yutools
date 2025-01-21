import { Table } from "./Table";

export class Row<T> {
  constructor(private table: Table<T>, public data: T) {}

  update(updates: Partial<T>): void {
    this.table.update((this.data as any).id, updates);
    this.data = { ...this.data, ...updates };
  }

  delete(): void {
    this.table.delete((this.data as any).id);
  }

  toObject(): T {
    return this.data;
  }
}