import './index.css';
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import APopover from './components/a-popover';
import { H1, H2, H3 } from './components/title';
import Blockquote from './components/blockquote';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as StyleHighlighter } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { deepCopy } from '@utils/index';

function MarkdownComponent ({ markdown }, ref) {

  // 保存目录项
  const contents = useRef([]);

  // 保存目录项映射[id, content]
  const contentsMap = new Map();

  // 保存当前指向的目录项下标, 当且仅当目录项的节点成功渲染时, 下标指向下一个目录项
  let contentsIndex = useRef(0);

  useEffect(() => {
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
   * @param {Array} content 
   */
  function setContents (content) {
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
  }

  /**
   * 获取目录项
   * @param {string} id 
   * @returns 
   */
  function getContent (id) {
    if (contentsMap.has(id)) {
      return deepCopy(contentsMap.get(id));
    }

    return null;
  }

  useImperativeHandle(ref, () => ({
    contents
  }));

  return (
    <Markdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      className='markdown'
      components={{
        code ({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? '');
          const _children = children ? String(children).replace(/\n$/, '') : ' ';
          return !inline && match ? (
            <SyntaxHighlighter
              children={_children}
              style={StyleHighlighter}
              className={`markdown-code markdown-long-code`}
              language={match[1]}
              PreTag='div'
              showLineNumbers={true}
              showInlineLineNumbers={true}
              customStyle={{
                paddingLeft: '0'
              }}
              {...props}
            />
          ) : (
            <code className={`markdown-code markdown-short-code ${className ?? ''}`} {...props}>
              {children}
            </code>
          )
        },
        a ({ className, children, ...props }) {
          return (
            <APopover
              className={`markdown-link ${className ?? ''}`}
              {...props}
            >
              {children}
            </APopover>
          )
        },
        blockquote ({ ...props }) {
          return <Blockquote {...props} />
        },
        pre ({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(children.props.className ?? '');
          return (
            <pre
              ref={(node) => {
                node && node.children && node.children[0] && node.children[0].setAttribute('data-language', match ? match[1] : '');
              }}
              className={`markdown-pre ${className ?? ''}`}
              {...props}
            >
              {children}
              <i
                className={`markdown-pre-copy`}
                onClick={(e) => {
                  const text = e.target.previousSibling.innerText.replace('1', '').replace(/\n(\d+)/g, '');

                  navigator.clipboard.writeText(text).then(() => {
                    // console.log('copy success');
                  }).catch(() => {
                    console.warn('copy fail')
                  });
                }}
              >copy</i>
            </pre>
          )
        },
        h1 ({ ...props }) {
          return <H1
            {...props}
            setContents={setContents}
            getContent={getContent}
          />
        },
        h2 ({ ...props }) {
          return <H2
            {...props}
            setContents={setContents}
            getContent={getContent}
          />
        },
        h3 ({ ...props }) {
          return <H3
            {...props}
            setContents={setContents}
            getContent={getContent}
          />
        }
      }}
    />
  )
}

export default forwardRef(MarkdownComponent);