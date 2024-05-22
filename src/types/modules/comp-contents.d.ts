import type { ElementTypeFunc } from '@type/utils/modules/Element.js';
import type {
  ContentTagType,
  ContentType,
  ContentsType,
} from './contents.d.ts';
import type { ContentChangeEventType } from './comp-contents-comp-content.d.ts';
import React from 'react';

/**
 * 获取目录的最深层级类型
 */
interface GetDeepestLayerFunc {
  (contents: ContentsType | ContentType): number;
}

/**
 * 计算目录的宽度类型
 */
interface GetContentsWidthCacheFunc {
  (
    contents: ContentsType,
    widthCacheL: React.MutableRefObject<`${number}px` | null>,
  ): `${number}px`;
}

/**
 * 计算目录的宽度辅助函数类型
 */
interface _GetContentWidthFunc {
  (contents: ContentType): void;
}

interface ChangeEventMapReturnContentType extends ContentType {
  label: string;
  path: string;
  entryFilePath?: string;
  icon?: string | null;
  tag?: ContentTagType;
  children?: ContentsType;
  component: ElementTypeFunc | null;
}

/**
 * Change事件映射返回类型
 */
interface ChangeEventMapReturnType extends ContentChangeEventType {
  path: string;
  content: {
    label: string;
    path: string;
    entryFilePath?: string;
    icon?: string | null;
    tag?: ContentTagType;
    children?: ContentsType;
    component: ElementTypeFunc | null;
  };
  component: React.JSX.Element | JSX.Element;
}

interface ChangeEventMapType {
  [key: number]: (event: ContentChangeEventType) => ChangeEventMapReturnType;
}

interface On_ChangeFunc {
  (context: ContentChangeEventType): void;
}

interface OnChangeFunc {
  (context: ChangeEventMapReturnType): void;
}

interface ContentsProps {
  title: string;
  contents: ContentsType;
  onChange: OnChangeFunc;
  onWidthLoad: (width: `${number}px`) => void;
}

export type {
  GetDeepestLayerFunc,
  GetContentsWidthCacheFunc,
  ChangeEventMapReturnContentType,
  ChangeEventMapReturnType,
  _GetContentWidthFunc,
  ChangeEventMapType,
  On_ChangeFunc,
  ContentsProps,
};
