import { PipelineStage, QueryOptions } from 'mongoose';

export default interface IGenericRepository<TEntity> {
  save(doc: Record<string, unknown>): Promise<TEntity>;
  findMany(query: PipelineStage[], options?: QueryOptions): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity>;
  updateById(id: string, doc: Record<string, unknown>): Promise<TEntity>;
  findOne(query: Record<string, unknown>): Promise<TEntity>;
}
