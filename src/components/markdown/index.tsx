import type {
  ContentType,
  ContentsType,
  MarkdownComponentProps,
  MarkdownComponentRef
} from '@type/modules/comp-markdown.d.ts';
import type { Components } from 'react-markdown';

import './index.css';
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Code from './components/code/index.tsx';
import Anchor from './components/a/index.tsx';
import Blockquote from './components/blockquote/index.tsx';
import Pre from './components/pre/index.tsx';
import Img from './components/img/index.tsx';
import Paragraph from './components/p/index.tsx';
import { H1, H2, H3 } from './components/title/index.tsx';
import { flatChildren } from '@utils/index.ts';

const _MarkdownComponent = (
  { markdown }: MarkdownComponentProps,
  ref: React.ForwardedRef<MarkdownComponentRef>
) => {
  // 保存目录项
  const contents = useRef<ContentsType>([]);

  // 保存当前指向的目录项下标, 当且仅当目录项的节点成功渲染时, 下标指向下一个目录项
  const contentsIndex = useRef(0);

  useEffect(() => {
    /*@__PURE__*/ (() => {
      const labels = contents.current.map((content) => content.label);
      const set = new Set(labels);
      if (set.size !== labels.length) {
        const title = labels[0];
        for (const label of labels) {
          if (set.has(label)) {
            set.delete(label);
          } else {
            throw new Error(
              `markdown文件 "${flatChildren(title)}" 的标题 "${flatChildren(label)}" 重复`
            );
          }
        }
      }
    })();
    contents.current.forEach((content) => {
      const { node } = content;
      if (!node) return;
      // 保存节点的占位高度
      const offsetTop = node.offsetTop;
      const marginTop = parseInt(window.getComputedStyle(node).marginTop);
      content.offsetTop = offsetTop + marginTop;
    });
    // 重置当前指向的目录项下标
    contentsIndex.current = 0;
  });

  /**
   * 设置 contents
   */
  const setContents = (content: ContentType) => {
    // 当前目录项已经存入目录项列表时, 更新其对应的节点
    if (contents.current[contentsIndex.current] && content.node) {
      contents.current[contentsIndex.current].node = content.node;
    }

    // 当前目录项未存入目录项列表时, 存入目录项列表
    if (!contents.current[contentsIndex.current]) {
      contents.current[contentsIndex.current] = content;
    }

    // 若传入的目录项的节点成功渲染, 则成功存入目录项, 下标指向下一个目录项
    if (content.node) {
      contentsIndex.current++;
    }
  };

  const components: Components = {
    code(props) {
      return <Code {...props} />;
    },
    a({ className, children, ...props }) {
      return (
        <Anchor className={`markdown-link ${className ?? ''}`} {...props}>
          {children}
        </Anchor>
      );
    },
    blockquote(props) {
      return <Blockquote {...props} />;
    },
    pre(props) {
      return <Pre {...props} />;
    },
    img(props) {
      return <Img {...props} />;
    },
    p(props) {
      return <Paragraph {...props} />;
    },
    h1(props) {
      return <H1 {...props} setContents={setContents} />;
    },
    h2(props) {
      return <H2 {...props} setContents={setContents} />;
    },
    h3(props) {
      return <H3 {...props} setContents={setContents} />;
    }
  };

  useImperativeHandle(ref, () => ({
    contents
  }));

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      className="markdown"
      components={components}
    >
      {markdown}
    </Markdown>
  );
};

const MarkdownComponent = forwardRef(_MarkdownComponent);

export default MarkdownComponent;
