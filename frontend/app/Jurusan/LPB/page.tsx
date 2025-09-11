import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Lpb from '@/app/Jurusan/LPB'  // ini file RPL.tsx yang sudah ada

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Lpb />
      <Footer />
    </div>
  )
}
