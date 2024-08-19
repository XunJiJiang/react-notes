export interface Setting {
  url: {
    hose: string;
    origin: string;
    pathname: string;
  };
  github: {
    url: string;
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
  }
};

export default setting;
