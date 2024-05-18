import type { KeyframeType, KeyframeTypes } from './comp-transition-hooks-useTransition.d.ts';

interface TransitionPropsType {
  mode?: 'in' | 'out' | 'out-in';
  children: React.ReactElement;
  keyframe?: KeyframeType;
  duration?: number;
  easing?: string;
}

export type { TransitionPropsType };
