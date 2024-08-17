import type { ContentType, ContentsType } from './comp-markdown.d.ts';

interface ChangeLocationFunc {
  (content: ContentType | null): void;
}

interface ContentsINPageRef {
  changeLocation: ChangeLocationFunc;
}

interface ContentsINPageProps {
  contents: ContentsType;
}

type ContentLabelType =
  | string
  | React.ReactNode
  | Array<string | React.ReactNode>;

export type {
  ChangeLocationFunc,
  ContentsINPageRef,
  ContentsINPageProps,
  ContentLabelType
};
