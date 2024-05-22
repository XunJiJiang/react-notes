import type { ElementTypeFunc } from '../utils/modules/Element.d.ts';

interface ContentsChangeHandlerType {
  component: ElementTypeFunc;
  content: Content;
  path: string;
}

export type { ContentsChangeHandlerType };
