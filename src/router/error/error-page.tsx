import NotFound from '@pages/404/index.tsx';
// import { useEffect } from 'react';
import {
  useRouteError,
  useLocation /*, useNavigate */
} from 'react-router-dom';
import { AnyMap } from '@utils/index.ts';

const errorTypeMap = new AnyMap();

errorTypeMap.set('NOT_FOUND', () => {
  const location = useLocation();
  return {
    ...location,
    message: `路径 ${location.pathname} 下没有内容`
  };
});
// TODO: 预计支持注册错误类型

function useError(type?: string) {
  const routeError = useRouteError();

  if (errorTypeMap.has(type)) {
    const error = errorTypeMap.get(type)();
    return error;
  }

  return (routeError ?? {
    statusText: 'Not Found'
  }) as {
    statusText: string;
  };
}

export default function ErrorPage({ type }: { type?: string }) {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (location.pathname !== '/error') navigate('/error');
  // });

  const error = useError(type);

  // const errorValue = errorTypeMap.get(error.statusText);

  return <NotFound info={error!.statusText || error!.message || void 0} />;
}
