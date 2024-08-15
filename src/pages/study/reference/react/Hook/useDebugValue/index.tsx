import PageTemplate from '@components/page-template/index.tsx';
import _markdown from './useDebugValue.md?raw';
import { markdownImgPathFormatting } from '@utils/index.js';
import CodeEditor from '@components/code-editor/index.tsx';

import {
  // useDebugValue,
  useState
} from 'react';

import imgUseDebugValue from '@img/react-reference/useDebugValue/useDebugValue.png';
import imgNotUseDebugValue from '@img/react-reference/useDebugValue/notUseDebugValue.png';

const imgPaths = [
  {
    replacementPath: imgUseDebugValue,
    originalPath:
      '../../../../../assets/images/react-reference/useDebugValue/useDebugValue.png',
    title: 'useDebugValue'
  },
  {
    replacementPath: imgNotUseDebugValue,
    originalPath:
      '../../../../../assets/images/react-reference/useDebugValue/notUseDebugValue.png',
    title: 'not useDebugValue'
  }
];

const markdown = markdownImgPathFormatting(_markdown, imgPaths);

const useMyHook = () => {
  const [state] = useState(0);
  // useDebugValue(state > 0 ? 'Positive' : 'Non-positive');
  return state;
};

const UseCallback = () => {
  useMyHook();

  return (
    <>
      <PageTemplate markdown={markdown}>
        <CodeEditor />
      </PageTemplate>
    </>
  );
};

export default UseCallback;
