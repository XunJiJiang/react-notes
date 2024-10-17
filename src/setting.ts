export interface Setting {
  url: {
    host: string;
    origin: string;
    pathname: string;
  };
  github: {
    url: string;
  };
  default: {
    contents: {
      expand: boolean;
    };
  };
}

const getUrl = (pathname: string) => {
  const url = window.location;
  return {
    host: url.host,
    origin: url.origin + pathname,
    pathname
  };
};

const setting: Setting = {
  url: getUrl(import.meta.env.BASE_URL),
  github: {
    url: 'https://github.com/XunJiJiang' + import.meta.env.BASE_URL
  },
  default: {
    contents: {
      // 展开全部菜单(未启用)
      expand: false
    }
  }
};

console.log(import.meta.env.BASE_ROUTE_URL);

export default setting;
