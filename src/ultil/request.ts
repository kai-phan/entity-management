import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ThisConstructor } from './entity.ts';

export class AxiosBase {
  static config?: AxiosRequestConfig;
  static instance: AxiosInstance;
  static create(config?: AxiosRequestConfig) {
    const instance = axios.create(config);

    // @ts-ignore
    this.prototype.constructor.config = config;
    // @ts-ignore
    this.prototype.constructor.instance = instance;

    return instance;
  }
}

export const createAxiosStatic = <C extends ThisConstructor<typeof AxiosBase>>(
  config?: AxiosRequestConfig,
  interceptors?: Axios['interceptors'],
  Constructor: C = AxiosBase as C,
) => {
  const axiosInstance = Constructor.create(config);

  if (interceptors) {
    axiosInstance.interceptors = interceptors;
  }

  return Object.assign(Constructor, axiosInstance);
};
