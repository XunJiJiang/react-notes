import './index.css';
import MarkdownComponent from '../markdown';

export default function PageTemplate ({ children, markdown }) {
  return (
    <div className='page-template'>
      <div className='page-template-markdown'>
        <MarkdownComponent markdown={markdown} />
      </div>
      <div className='page-template-render'>
        {children}
      </div>
    </div>
  )
}