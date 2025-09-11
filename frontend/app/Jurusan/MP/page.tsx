import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Mp from '@/app/Jurusan/MP'  // ini file RPL.tsx yang sudah ada

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Mp />
      <Footer />
    </div>
  )
}
