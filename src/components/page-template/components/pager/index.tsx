import type { LoaderData } from '@type/modules/comp-page-template-comp-pager.d.ts';

import './index.css';
import { Link, useAsyncValue } from 'react-router-dom';
import Icon from '@/components/icon';
// import { useLoaderDataWithType } from '@utils/index.ts';

const Pager = () => {
  // let prev, next;
  // const asyncValue = useAsyncValue() as LoaderData;
  // const loaderData = useLoaderDataWithType<{
  //   data: LoaderData;
  // }>().data;
  const { prev, next } = (useAsyncValue() as LoaderData).pages;
  // console.log(useAsyncValue());
  //   useLoaderDataWithType<LoaderData>().pages;
  // console.log(asyncValue, loaderData);
  // if (!asyncValue || !asyncValue.pages) {
  //   prev = loaderData?.pages?.prev;
  //   next = loaderData?.pages?.next;
  // } else {
  //   prev = asyncValue.pages.prev;
  //   next = asyncValue.pages.next;
  // }
  return (
    <nav className="prev-next">
      <div className="pager">
        {prev.label && prev.path && (
          <Link to={'../' + prev.path} className="pager-link prev">
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
          <Link to={'../' + next.path} className="pager-link next">
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
