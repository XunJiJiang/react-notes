import type { PathListType } from '@type/modules/comp-contents-context-pathList.d.ts';

import { createContext } from 'react';

const PathList = createContext<PathListType | null>(null);

export default PathList;
