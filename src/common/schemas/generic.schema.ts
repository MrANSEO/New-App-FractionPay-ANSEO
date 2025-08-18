export default abstract class GenericEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;

  static toLightPlainObject<T extends GenericEntity>(entity: T): T {
    const obj = { ...entity };

    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  }
}
