import { useInfiniteQuery, useMutation, useQuery } from 'react-query';

export class Adapter {}

export class ReactQueryAdapter extends Adapter {
  static useQuery = useQuery;
  static useMutation = useMutation;
  static useInfiniteQuery = useInfiniteQuery;
}
