// import type { Components, ExtraProps } from 'react-markdown';

type ContentLabelType = React.ReactNode | Array<React.ReactNode>;

interface ContentType {
  id: string;
  label: ContentLabelType;
  hash: string;
  level: number;
  node: HTMLElement;
  offsetTop: number;
}

type ContentsType = ContentType[];

interface MarkdownComponentProps {
  markdown: string;
}

interface MarkdownComponentRef {
  contents: React.MutableRefObject<ContentsType>;
}

// interface MarkdownComponentFunc {
//   (
//     props: MarkdownComponentProps,
//     ref: React.ForwardedRef<MarkdownComponentRef>,
//   ): React.JSX.Element;
// }

// type ComponentsFuncProps<TagName> =
//   | Component<JSX.IntrinsicElements[TagName] & ExtraProps>
//   | keyof JSX.IntrinsicElements;

// interface ComponentsFunc<TagName> {
//   (props: ComponentsFuncProps<TagName>): React.JSX.Element;
// }

export type {
  ContentType,
  ContentsType,
  ContentLabelType,
  MarkdownComponentProps,
  MarkdownComponentRef
  // MarkdownComponentFunc,
  // ComponentsFuncProps,
  // ComponentsFunc,
};
