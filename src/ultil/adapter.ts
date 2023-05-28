import {
  DefaultOptions,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueries,
} from 'react-query';

export class ReactQueryAdapter {
  static defaultOptions: DefaultOptions;
  static queryClient: QueryClient;

  static getQueryClient() {
    return this.queryClient;
  }

  static getDefaultOptions() {
    return this.defaultOptions;
  }

  static useQuery = useQuery;
  static useMutation = useMutation;
  static useInfiniteQuery = useInfiniteQuery;
  static useQueries = useQueries;
}

export const createReactQueryAdapter = (defaultOptions: DefaultOptions) => {
  class Adapter extends ReactQueryAdapter {
    static defaultOptions = defaultOptions;
    static queryClient = new QueryClient({ defaultOptions });
  }

  return Adapter;
};
