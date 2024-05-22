import React from 'react';
import type { ContentType } from './contents.d.ts';
import type { ElementTypeFunc } from '@type/utils/modules/Element.js';

type ContentChangePathType = Array<string | null>;

/**
 * ContentType扩展类型
 */
interface ContentTypeExtend extends ContentType {
  _mark_?: {
    code: number | `${number}`;
    msg: string;
    createNewContent?: () => {
      label: string;
      path: string;
      component: ElementTypeFunc | null;
    };
  };
}

interface ContentTypeExtendForChange extends ContentTypeExtend {
  entryFilePath?: string | undefined;
  icon?: string | null;
  tag?: ContentTagType;
}

/**
 * Change事件参数类型
 */
interface ContentChangeEventType {
  content: ContentTypeExtendForChange;
  path: ContentChangePathType;
  component: React.JSX.Element;
}

/**
 * 寻找组件
 * 返回最上级存在的最近的组件类型
 */
interface FindComponentFunc {
  (
    content: ContentTypeExtendForChange,
  ): [
    (props: React.ComponentProps<T>) => React.JSX.Element | JSX.Element,
    ContentTypeExtendForChange,
  ];
}

/**
 * DeepHeightList类型
 * 储存当前组件和每个子选项组件的深度展开的高度信息. 下标高位为父级的深度, 低位为子级的深度
 */
interface DeepHeightListType extends Array<number> {}

/**
 * Content组件props类型
 */
interface ContentProps {
  contents: Array<ContentTypeExtendForChange>;
  visible: boolean;
  layer: number;
  onChange: (context: ContentChangeEventType) => void;
  changeFatherDeepList?: (childDeepList: DeepHeightListType) => void;
}

/**
 * Content组件ref类型
 */
interface ContentRef {
  inVisible: () => void;
  buttonHeight: number;
}

export type {
  ContentChangePathType,
  ContentTypeExtendForChange,
  ContentChangeEventType,
  ContentTypeExtend,
  FindComponentFunc,
  ContentProps,
  ContentRef,
};
