// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const UploadPage = () => {
  return (
    <>
      <Metadata title="Upload" description="Upload page" />

      <h1>UploadPage</h1>
      <p>
        Find me in <code>./web/src/pages/UploadPage/UploadPage.tsx</code>
      </p>
      {/*
          My default route is named `upload`, link to me with:
          `<Link to={routes.upload()}>Upload</Link>`
      */}
    </>
  )
}

export default UploadPage
