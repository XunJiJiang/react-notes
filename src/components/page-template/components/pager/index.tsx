import type { LoaderData } from '@type/modules/comp-page-template-comp-pager.d.ts';

import './index.css';
import { Link } from 'react-router-dom';
import Icon from '@/components/icon';
import { useLoaderDataWithType } from '@utils/index.ts';

const Pager = () => {
  const { prev, next } = useLoaderDataWithType<LoaderData>().pages;

  return (
    <nav className="prev-next">
      <div className="pager">
        {prev.label && prev.path && (
          <Link to={'/' + prev.path} className="pager-link prev">
            <Icon name="left" className="pager-icon" size={12} />
            <div className="pager-desc">
              <span className="desc">上一页</span>
              <span className="desc pager-title">{prev.label}</span>
            </div>
          </Link>
        )}
      </div>
      <div className="pager">
        {next.label && next.path && (
          <Link to={'/' + next.path} className="pager-link next">
            <Icon name="right" className="pager-icon" size={12} />
            <div className="pager-desc">
              <span className="desc">下一页</span>
              <span className="desc pager-title">{next.label}</span>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Pager;
