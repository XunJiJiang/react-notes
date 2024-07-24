import NotFound from '@pages/404/index.tsx';
import { useEffect } from 'react';
import { useRouteError, useLocation, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.pathname, useRouteError());

  useEffect(() => {
    if (location.pathname !== '/error') navigate('/error');
  });

  const error = (useRouteError() ?? {
    statusText: 'Not Found'
  }) as {
    statusText: string;
  };

  return <NotFound info={error!.statusText || 'Not Found'} />;
}
