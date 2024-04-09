import PageTemplate from '@components/page-template/index';
import reactLearn from './01React Learn.md';


export default function Learn () {
  return (
    <>
      <PageTemplate markdown={reactLearn}>
        <h1>Learn</h1>
      </PageTemplate>
    </>
  )
}