import './index.css';

export default function NotFound({ info = '' }) {
  return (
    <div className="not-found">
      <div>
        <h1>404 Not Found</h1>
        <p>{info}</p>
      </div>
    </div>
  );
}
