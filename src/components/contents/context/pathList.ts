import type { PathListType } from '@type/modules/comp-contents-context-pathList.d.ts';

import { createContext } from 'react';

const PathList = createContext<React.MutableRefObject<PathListType> | null>(null);

export default PathList;
