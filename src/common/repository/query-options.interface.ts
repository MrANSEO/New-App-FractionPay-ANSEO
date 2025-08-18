import { QueryOptions } from 'mongoose';

export default interface IQueryOptions extends QueryOptions {
  autopopulate?: boolean | { maxDepth: number };
}
