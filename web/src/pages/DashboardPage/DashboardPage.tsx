// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import PrivateRoute from 'src/components/PrivateRoute'

const DashboardPage = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Dashboard page" />

      <PrivateRoute>
        <h1>Dashboard</h1>
      </PrivateRoute>
    </>
  )
}

export default DashboardPage
