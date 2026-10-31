import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const HomeLayout = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Outlet />
      </div>
      {location.pathname !== '/' && <Footer />}
    </>
  )
}

export default HomeLayout
