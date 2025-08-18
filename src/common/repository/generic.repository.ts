import { NotFoundException } from '@nestjs/common';
import { HydratedDocument, Model, PipelineStage, UpdateQuery } from 'mongoose';
import IGenericRepository from './generic.repository.interface';
import IQueryOptions from './query-options.interface';

export default class GenericRepository<
  TEntity,
  TModel extends Model<HydratedDocument<TEntity>> = Model<HydratedDocument<TEntity>>,
> implements IGenericRepository<TEntity>
{
  constructor(private model: TModel) {}

  protected mapRawDocument(rawDocument: Record<string, unknown>): TEntity {
    if (rawDocument._id) {
      rawDocument.id = rawDocument._id;
      delete rawDocument._id;
    }
    delete rawDocument.__v;

    return rawDocument as TEntity;
  }

  findById(id: string, options: IQueryOptions = {}): Promise<TEntity> {
    return this.model
      .findById(id, {}, options)
      .exec()
      .then((doc) => {
        if (doc == null) {
          throw new NotFoundException(
            `The entity cannot be found in database, Model: ${this.model.collection.name}, Operation: findById, id: ${id}`,
          );
        } else return doc.toJSON() as TEntity;
      });
  }

  findMany(query: PipelineStage[]): Promise<TEntity[]> {
    return this.model
      .aggregate(query)
      .exec()
      .then((docs: null | Record<string, unknown>[]) => {
        if (docs == null) throw new NotFoundException();
        else return docs.map((a) => this.mapRawDocument(a));
      });
  }

  aggregateCount(query: PipelineStage.Match): Promise<number> {
    return this.model.aggregate([query, { $count: 'totalDocuments' }]).then((result): number => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return (result[0]?.totalDocuments as number) ?? 0;
    });
  }

  save(doc: Record<string, unknown>): Promise<TEntity> {
    const modelInstance = new this.model(doc);
    return modelInstance.save().then((res) => {
      return res.toJSON() as TEntity;
    });
  }

  updateById(
    id: string,
    doc: Record<string, unknown>,
    options: IQueryOptions = { new: true },
  ): Promise<TEntity> {
    return this.model
      .findByIdAndUpdate(id, doc, { new: true, ...options })
      .exec()
      .then((updated) => {
        if (updated === null) {
          throw new NotFoundException(
            `The entity cannot be found in database, Collection: ${this.model.collection.name}, Operation: UpdateById, id: ${id}`,
          );
        } else return updated.toJSON() as TEntity;
      });
  }

  updateOne(query: Record<string, unknown>, update: PipelineStage[] | UpdateQuery<unknown>) {
    return this.model.updateOne(query, update);
  }

  findOne(query: Record<string, unknown>, options: IQueryOptions = {}): Promise<TEntity> {
    return this.model
      .findOne(query, {}, options)
      .exec()
      .then((doc) => {
        if (doc == null) throw new NotFoundException();
        return doc.toJSON() as TEntity;
      });
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id).then((doc) => {
      if (!doc) throw new NotFoundException(`Cannot delete ${id}`);
      return doc.toJSON() as TEntity;
    });
  }

  updateMany(query: Record<string, unknown>, update: PipelineStage[] | UpdateQuery<unknown>) {
    return this.model.updateMany(query, update);
  }
}
