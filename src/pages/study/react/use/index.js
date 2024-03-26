import PageTemplate from '../../../../components/page-template/index';


export default function Use () {
  return (
    <>
      <PageTemplate>
        <a href='#qwe'>123</a>
        <h1 style={{
          height: '100vh'
        }}>Use</h1>
        <h1 id='qwe' style={{
          height: '100vh'
        }}>Use</h1>
      </PageTemplate>
    </>
  )
}