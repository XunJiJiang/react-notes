import type { ElementTypeFunc } from '../utils/modules/Element.d.ts';

type ContentTagType =
  | 'string'
  | {
      icon: string;
    }
  | null;

interface ContentType {
  label: string;
  path: string;
  entryFilePath: string;
  icon: string | null;
  tag: ContentTagType;
  component: ElementTypeFunc | null;
  children?: ContentsType;
}

interface ContentsType extends Array<ContentType> {}

export type { ContentType, ContentTagType, ContentsType };
