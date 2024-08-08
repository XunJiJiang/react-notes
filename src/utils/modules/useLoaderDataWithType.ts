import { useLoaderData } from 'react-router-dom';

export default function useLoaderDataWithType<T>() {
  return useLoaderData() as T extends Promise<unknown> ? Awaited<T> : T;
}
