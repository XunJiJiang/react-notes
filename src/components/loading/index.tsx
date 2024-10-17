import './index.css';

interface LoadingProps {
  children?: React.ReactNode;
  size?: number;
}

const Loading = ({ children, size = 0.7 }: LoadingProps) => {
  return (
    <div
      id="loading"
      ref={(node) => {
        if (!node) return;
        node.style.setProperty('--size', `${size}`);
      }}
    >
      {/* <section> */}
      <div className="load-container load8">
        <div className="loader">Loading...</div>
      </div>
      {children}
      {/* </section> */}
    </div>
  );
};

export default Loading;
