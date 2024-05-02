import './index.css';

function Img ({ src, alt, className, ...props }) {
  return (
    <img
      className={`markdown-img ${className ?? ''}`}
      src={src}
      alt={alt}
      onError={(e) => {
        e.target.setAttribute('data-img-is-error', true);
      }}
      onLoad={(e) => {
        e.target.setAttribute('data-img-is-error', false);
      }}
      {...props}
    />
  )
}

export default Img;
