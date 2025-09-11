import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Rpl from './Jurusan/RPL'

const page = () => {
  return (
    <div className='bg-white'>
      <Navbar />
      <Rpl />
      <Footer />
    </div>
  )
}

export default page
