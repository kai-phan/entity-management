import { Mixin } from 'ts-mixer';
import { UseQueryOptions } from 'react-query';
import { AxiosError } from 'axios';
import { QueryFunctionContext } from 'react-query/types/core/types';

import {
  EntityBase,
  createAxiosStatic,
  ThisConstructor,
  This,
  createReactQueryAdapter,
} from '../ultil';

export const AxiosStatic = createAxiosStatic({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export const QueryAdapter = createReactQueryAdapter({
  queries: {
    retry: false,
    refetchOnMount: false,
  },
});

export class Entity extends Mixin(EntityBase, AxiosStatic, QueryAdapter) {
  static getKey(): [string];
  static getKey<Params>(params: Params): [string, Params];
  static getKey<Params>(params?: Params): [string, Params] | [string] {
    return params ? [this.endpoint, params] : [this.endpoint];
  }

  static async queryListFn<Params, C extends ThisConstructor<typeof Entity>>(
    this: C,
    { queryKey }: QueryFunctionContext<[string, Params]>,
  ): Promise<This<C>[]> {
    const [primaryKey, params] = queryKey;
    const { data } = await this.get(primaryKey, { params, ...this.config });

    return this.createMany(data);
  }

  static async queryOneFn<
    Path extends string | number,
    C extends ThisConstructor<typeof Entity>,
  >(
    this: C,
    { queryKey }: QueryFunctionContext<[string, Path]>,
  ): Promise<This<C>> {
    const [primaryKey, path] = queryKey;
    const { data } = await this.get(`${primaryKey}/${path}`, this.config);

    return this.createOne(data);
  }

  static useQueryList<Params, C extends ThisConstructor<typeof Entity>>(
    this: C,
    options?: UseQueryOptions<
      This<C>[],
      AxiosError,
      This<C>[],
      [string, Params]
    > & { variables?: Params },
  ) {
    const { variables } = options ?? {};

    return this.useQuery({
      queryKey: [this.endpoint, variables as Params],
      queryFn: this.queryListFn.bind(this),
      ...options,
    });
  }

  /**
   * @params { options: QueryOptions<Constructor type, AxiosError, Constructor type, [string, Path]> & { variables?: Path }
   * @returns UseQueryResult<Constructor type, AxiosError>
   **/
  static useQueryOne<
    Path extends string | number,
    C extends ThisConstructor<typeof Entity>,
  >(
    this: C,
    options?: UseQueryOptions<This<C>, AxiosError, This<C>, [string, Path]> & {
      variables?: Path;
    },
  ) {
    return this.useQuery({
      queryKey: [this.endpoint, options?.variables as Path],
      queryFn: this.queryOneFn.bind(this),
      ...options,
    });
  }

  // useMutation<I extends This<typeof Entity>>(this: I) {
  //   const { config, endpoint, put } = this.constructor as ThisConstructor<
  //     typeof Entity
  //   >;
  //
  //   return (this.constructor as ThisConstructor<typeof Entity>).useMutation({
  //     mutationFn: async (variables) => {
  //       const { data } = await put(endpoint, variables, config);
  //
  //       return (this.constructor as ThisConstructor<typeof Entity>).createOne(
  //         data,
  //       );
  //     },
  //     ...config,
  //   });
  // }
}
