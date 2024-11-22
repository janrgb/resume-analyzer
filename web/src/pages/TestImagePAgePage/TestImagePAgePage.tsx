// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TestImagePAgePage = () => {
  return (
    <>
      <Metadata title="TestImagePAge" description="TestImagePAge page" />

      <h1>TestImagePAgePage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/TestImagePAgePage/TestImagePAgePage.tsx</code>
      </p>
      <p>
        Hello World!!!
      </p>
      {/*
          My default route is named `testImagePAge`, link to me with:
          `<Link to={routes.testImagePAge()}>TestImagePAge</Link>`
      */}
      <img src="/cat.jpg" alt="My Image" style={{ width: '300px', height: 'auto' }}/>
    </>
  )
}

export default TestImagePAgePage
