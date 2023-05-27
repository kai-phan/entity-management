/**
 * @description Whether value is a constructor
 * @example Array.prototype.constructor === Array // true
 * @example type ThisConstructor<typeof Array> === typeof Array // true
 **/
export type ThisConstructor<
  T extends { prototype: unknown } = { prototype: unknown },
> = T;

/**
 * @description Get instance type from constructor type,
 * (every instance will have a prototype object that points to the constructor that created it)
 * (type of that prototype is also the type of instance)
 * @example type This<typeof Entity> === Entity // true
 **/
export type This<T extends ThisConstructor> = T['prototype'];

export default class EntityBase {
  constructor(origin?: unknown) {
    Object.assign(this, origin);
  }

  static endpoint = '';

  static getClass<
    ConstructorFunction extends ThisConstructor<typeof EntityBase>,
  >(this: ConstructorFunction): ConstructorFunction {
    return this;
  }

  static createMany<
    ConstructorFunction extends ThisConstructor<typeof EntityBase>,
  >(this: ConstructorFunction, list: unknown[]): This<ConstructorFunction>[] {
    return list.map((i) => new this(i));
  }

  static createOne<
    ConstructorFunction extends ThisConstructor<typeof EntityBase>,
  >(this: ConstructorFunction, entity: unknown): This<ConstructorFunction> {
    return new this(entity);
  }

  clone<Instance extends This<typeof EntityBase>>(this: Instance): Instance {
    // @ts-ignore
    return new this.constructor(this) as Instance;
  }

  static hasInstance<
    ConstructorFunction extends ThisConstructor<typeof EntityBase>,
  >(
    this: ConstructorFunction,
    entity: unknown,
  ): entity is This<ConstructorFunction> {
    return entity instanceof this;
  }
}
