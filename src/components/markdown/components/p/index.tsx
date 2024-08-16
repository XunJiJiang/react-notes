import type { ParagraphProps } from '@/types/modules/comp-markdown-comp-p.d.ts';

import './index.css';

const Paragraph = ({ children }: ParagraphProps) => {
  return <p className="markdown-p">{children}</p>;
};

export default Paragraph;
