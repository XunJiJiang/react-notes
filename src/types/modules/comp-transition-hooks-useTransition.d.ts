type CssType = {
  [key: string]: string | number;
};

interface KeyframeType {
  in?: CssType[];
  out?: CssType[];
}

interface KeyframeTypes {
  'out-in': {
    out: CssType[];
    in: CssType[];
  };
  in: {
    in: CssType[];
  };
  out: {
    out: CssType[];
  };
}

interface RunAnimateFunc {
  (
    children: React.ReactElement,
    options: {
      mode: 'in' | 'out' | 'out-in';
      keyframe: KeyframeType;
      duration: number;
      easing: string;
    },
    setNowChild: (children: React.ReactElement) => void,
    isVisible: React.MutableRefObject<React.ReactElement>
  ): void;
}

export type { KeyframeType, KeyframeTypes, RunAnimateFunc };
