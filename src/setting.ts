export interface Setting {
  url: {
    hose: string;
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

const setting: Setting = {
  url: {
    hose: 'http://localhost:3000',
    origin: 'http://localhost:3000/reactnotes/',
    pathname: '/reactnotes/'
  },
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
