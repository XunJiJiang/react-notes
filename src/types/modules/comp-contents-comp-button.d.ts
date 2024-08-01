import type { ElementTypeFunc } from '@type/utils/modules/Element';
import React from 'react';

interface SetSelectedStyleFunc {
  (isSelected: boolean | { expand: boolean; selected: boolean }): void;
}

interface ButtonProps {
  title: string;
  tag?: string | null | { icon: string } | ElementTypeFunc;
  icon?: string | null;
  isBranch: boolean;
  visible: boolean;
  state?: {
    isExpand: boolean,
    isSelected: boolean
  }
  onClick?: (event: Mouse) => void;
}

interface ButtonRef {
  setSelectedStyle: SetSelectedStyleFunc;
  clientHeight: number | null;
}

export type { SetSelectedStyleFunc, ButtonProps, ButtonRef };
