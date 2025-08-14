export interface IBaseService<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  findAll(filter?: object): Promise<T[]>;
  findOne(filter: object): Promise<T | null>;
  insertMany(data: T[]): Promise<void>;
}
