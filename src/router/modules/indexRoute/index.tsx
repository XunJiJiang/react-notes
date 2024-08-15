import './index.css';
import Icon from '@components/icon/index.tsx';

const Index = () => {
  return (
    <div id="zero-state">
      <p>
        <Icon name="code" className="zero-state-icon" size={56} />
        <br />
        This is a note about React.
        <br />
        Check out{' '}
        <a href="https://zh-hans.react.dev">
          the docs at https://zh-hans.react.dev
        </a>
        .
      </p>
    </div>
  );
};

export default Index;
