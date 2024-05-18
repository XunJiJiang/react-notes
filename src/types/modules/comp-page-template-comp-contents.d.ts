import type { ContentType, ContentsType } from './comp-markdown.d.ts';

interface ChangeLocationFunc {
  (content: ContentType): void;
}

interface ContentsINPageRef {
  changeLocation: ChangeLocationFunc;
}

interface ContentsINPageProps {
  contents: ContentsType;
}

export type { ChangeLocationFunc, ContentsINPageRef, ContentsINPageProps };
