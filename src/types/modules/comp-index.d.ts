import type { ElementTypeFunc } from '../utils/modules/Element.d.ts';
import type { ContentType } from './contents.d.ts';

interface ContentsChangeHandlerType {
  component: ElementTypeFunc;
  content: Content;
  path: string;
}

export type { ContentsChangeHandlerType };
