import './index.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const { highlight } = hljs;

const code = highlight(
  `function CodeEditor () {
  return {
    test: true
  };
}`,
  {
    language: 'javascript',
    ignoreIllegals: true,
  }
);

function CodeEditor() {
  return (
    <pre>
      {/* <code
        ref={node => {
          if (node) {
            function inputHandler(e: InputEvent) {
              const code = highlight(e.target?.innerText, {
                language: 'javascript',
                ignoreIllegals: true,
              });
              e.target.innerHTML = code.value;
              console.dir(node);
              node.addEventListener('input', inputHandler, { once: true });
            }
            node.innerHTML = code.value;
            node.setAttribute('contenteditable', 'true');
            node.addEventListener('input', inputHandler, { once: true });
          }
        }}
        className="editor hljs"
      ></code> */}
    </pre>
  );
}

export default CodeEditor;
