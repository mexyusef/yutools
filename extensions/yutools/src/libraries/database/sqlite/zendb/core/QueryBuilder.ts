import { Row } from "./Row";

export class QueryBuilder<T> {

  private whereClause: string = '';
  private orderByClause: string = '';
  private limitClause: string = '';
  private params: any[] = [];

  constructor(private db: any, private tableName: string) {}
//   where(criteria: Partial<T>): this {
//     this.whereClause = `WHERE ${Object.keys(criteria).map(key => `${key} = ?`).join(' AND ')}`;
//     return this;
//   }
  where(criteria: Record<string, any>): this {
    const conditions = Object.entries(criteria).map(([key, value]) => {
      if (typeof value === 'object' && value.$like) {
        this.params.push(value.$like);
        return `${key} LIKE ?`;
      } else {
        this.params.push(value);
        return `${key} = ?`;
      }
    });
    this.whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return this;
  }

  orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.orderByClause = `ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): this {
    this.limitClause = `LIMIT ${count}`;
    return this;
  }

  all(): Row<T>[] {
    const query = `SELECT * FROM ${this.tableName} ${this.whereClause} ${this.orderByClause} ${this.limitClause}`;
    // // const rows = this.db.prepare(query).all();
    // const rows = this.db.prepare(query).all(...this.params);
    // return rows.map((row: T) => new Row<T>(this as any, row));
    console.log(`🟢Executing SQL: ${query}`); // Log the SQL statement
    // console.log(`
      
    //   🧩Params: ${JSON.stringify(this.params)}
      
    // `); // Log the parameters

    try {
      const rows = this.db.prepare(query).all(...this.params);
      return rows.map((row: T) => new Row<T>(this as any, row));
    } catch (error: any) {
      console.error(`Failed to execute query: ${error.message}`);
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  first(): Row<T> | null {
    const rows = this.limit(1).all();
    return rows.length > 0 ? rows[0] : null;
  }
}