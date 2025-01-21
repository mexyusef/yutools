export interface TableSchema<T> {
  [key: string]: {
    type: 'integer' | 'text' | 'real' | 'blob';
    primaryKey?: boolean;
    autoIncrement?: boolean;
    required?: boolean;
    unique?: boolean;
  };
}