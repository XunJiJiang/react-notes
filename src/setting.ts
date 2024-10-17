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
  url: getUrl('/reactnotes/'),
  github: {
    url: 'https://github.com/XunJiJiang/react-notes'
  },
  default: {
    contents: {
      // 展开全部菜单(未启用)
      expand: false
    }
  }
};

export default setting;
