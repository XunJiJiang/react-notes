import './index.css';

export default function NotFound({ info = '' }: { info?: string }) {
  return (
    <div className="not-found">
      <div>
        <h1>404 Not Found</h1>
        <p>{info}</p>
      </div>
    </div>
  );
}
