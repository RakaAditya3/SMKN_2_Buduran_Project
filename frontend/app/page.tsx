import React from 'react'
import Home from './/Pages/Home/page';
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

const page = () => {
  return (
    <div>
      <Navbar />
        <Home />
      <Footer />
    </div>
  )
}

export default page
