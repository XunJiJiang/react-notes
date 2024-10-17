import './index.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '@/assets/favicon.ico';
import Icon from '@components/icon';

const Base = () => {
  const location = useLocation();
  return (
    <div className="layout-base">
      <header className="base-nav">
        <div className="top">
          <div className="container">
            <div className="title">
              <Link to={'/'} className="nav-bar-title">
                <img src={Logo} alt="logo" className="logo" />
                React Notes
              </Link>
            </div>
            <div className="content">
              <div className="curtain"></div>
              <div className="content-body">
                <div className="search">
                  <div className="local-search">
                    <button className="doc-search-button">
                      <span className="doc-search-container">
                        <Icon
                          className="doc-search-icon"
                          name="search"
                          size={16}
                        />
                        <span className="doc-search-placeholder">Search</span>
                      </span>
                      <span className="doc-search-button-keys">
                        <kbd className="doc-search-button-key"></kbd>
                        <kbd className="doc-search-button-key">K</kbd>
                      </span>
                    </button>
                  </div>
                </div>
                <nav
                  aria-labelledby="main-nav-aria-label"
                  className="nav-bar-menu menu"
                >
                  <Link
                    className={`nav-bar-menu-link${location.pathname === '/' ? ' active' : ''}`}
                    to={'/'}
                    tabIndex={0}
                  >
                    首页
                  </Link>
                  <Link
                    className={`nav-bar-menu-link${location.pathname.startsWith('/doc') ? ' active' : ''}`}
                    to={'/doc/react/learn'}
                    tabIndex={0}
                  >
                    文档
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="base-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Base;
