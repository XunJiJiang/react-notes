import './index.css';

export default function NotFound({ info = '' }: { info?: string }) {
  return (
    <div className="not-found">
      <div>
        <h1>哦不! </h1>
        <p>不好意思, 这貌似是一个预期外的问题</p>
        <p>{info}</p>
      </div>
    </div>
  );
}
