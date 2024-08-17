type RectStyle = {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
};

type ColorStyle = {
  background: string;
};

export interface XScrollProps {
  children: React.ReactNode | string | null;
  scrollStyle?: {
    scrollbar?: RectStyle;
    scrollThumb?: RectStyle;
    scrollTrack?: RectStyle;
    scrollbarHover?: ColorStyle;
    scrollThumbHover?: ColorStyle;
    scrollTrackHover?: ColorStyle;
    scrollbarActive?: ColorStyle;
    scrollThumbActive?: ColorStyle;
    scrollTrackActive?: ColorStyle;
    scrollbarButton?: RectStyle;
    scrollbarButtonHover?: ColorStyle;
    scrollbarButtonActive?: ColorStyle;
  };
}
