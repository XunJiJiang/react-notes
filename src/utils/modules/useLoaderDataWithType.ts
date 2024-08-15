import { useLoaderData } from 'react-router-dom';

const useLoaderDataWithType = <T>() => {
  return useLoaderData() as T extends Promise<unknown> ? Awaited<T> : T;
};

export default useLoaderDataWithType;
