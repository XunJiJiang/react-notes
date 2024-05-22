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
  onClick: (event: ButtonEventTarget) => void;
}

interface ButtonRef {
  setSelectedStyle: SetSelectedStyleFunc;
  clientHeight: number | null;
}

interface ButtonEventTarget
  extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
  setSelectedStyle: SetSelectedStyleFunc;
}

export type { SetSelectedStyleFunc, ButtonProps, ButtonRef, ButtonEventTarget };
