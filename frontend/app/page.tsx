import React from 'react'
import Home from './/Pages/Home/page';
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Rpl from './Jurusan/RPL'

const page = () => {
  return (
    <div className='bg-white'>
      <Navbar />
        <Home />
      <Footer />
    </div>
  )
}

export default page
