import PageTemplate from '@components/page-template/index';
import markdown from './01React Learn.md';


export default function Learn () {
  return (
    <>
      <PageTemplate markdown={markdown}>
        <h1>Learn</h1>
      </PageTemplate>
    </>
  )
}