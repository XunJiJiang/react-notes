import type { KeyframeType } from './comp-transition-hooks-useTransition.d.ts';

interface TransitionProps {
  mode?: 'in' | 'out' | 'out-in';
  children: React.ReactElement;
  keyframe?: KeyframeType;
  duration?: number;
  easing?: string;
}

export type { TransitionProps };
