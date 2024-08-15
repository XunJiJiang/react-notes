import './index.css';

const NotFound = ({ info = '' }: { info?: string }) => {
  return (
    <div className="not-found">
      <div>
        <h1>哦不!</h1>
        <p>
          {typeof info === 'undefined'
            ? '不好意思, 这貌似是一个预期外的问题'
            : '建议您检查下一输入的路径!'}
        </p>
        <p>{info}</p>
      </div>
    </div>
  );
};

export default NotFound;
