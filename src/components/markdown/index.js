import './index.css';
import { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import APopover from './components/a-popover';
import { H1, H2, H3 } from './components/title';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as StyleHighlighter } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { deepCopy } from '../../utils';

function MarkdownComponent ({ markdown }, ref) {
  const contents = useRef([]);

  const contentsMap = new Map();

  let setContentsIndex = useRef(0);

  let getContentIndex = useRef(0);

  useEffect(() => {
    contents.current.forEach((content) => {
      const { node } = content;
      if (!node) return;
      const offsetTop = node.offsetTop;
      const marginTop = parseInt(window.getComputedStyle(node).marginTop);
      content.offsetTop = offsetTop + marginTop;
    });
    setContentsIndex.current = 0;
    getContentIndex.current = 0;
  });

  /**
   * 设置 contents
   * @param {Array} content 
   */
  function setContents (content) {
    if (contents.current[setContentsIndex.current] && content.node) {
      contents.current[setContentsIndex.current].node = content.node;
    }
    
    if (!contents.current[setContentsIndex.current]) {
      contents.current[setContentsIndex.current] = content;
    }

    if (content.node) {
      setContentsIndex.current++;
    }
  }

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
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              style={StyleHighlighter}
              className={`markdown-code markdown-long-code`}
              language={match[1]}
              PreTag='div'
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
        blockquote ({ node, inline, className, children, ...props }) {
          return (
            <blockquote
              className={`markdown-blockquote ${className ?? ''}`}
              {...props}
            >
              {children}
            </blockquote>
          )
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
                  const text = e.target.previousSibling.innerText;
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