import './index.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="layout-home">
      <div className="home-content">
        <div className="home-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="name">React Notes</h1>
              <p className="text">静态网站生成器</p>
              <p className="tagline">React Static Site Generator</p>
              <div className="actions">
                <div className="action">
                  <Link className="button-medium brand" to="/doc/react/learn">
                    文档
                  </Link>
                </div>
                <div className="action">
                  <a
                    className="button-medium alt"
                    href="https://github.com/XunJiJiang/react-notes"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="home-features"></div>
      </div>
    </div>
  );
};

export default Home;
