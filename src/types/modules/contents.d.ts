import type { ElementTypeFunc } from '../utils/modules/Element.d.ts';

type ContentTagType =
  | string
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
  childrenSort: { [key: string]: number | undefined };
}

interface ContentsType extends Array<ContentType> {}

export type { ContentType, ContentTagType, ContentsType };
