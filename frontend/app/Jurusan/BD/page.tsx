import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Bd from '@/app/Jurusan/BD'  // ini file RPL.tsx yang sudah ada

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Bd />
      <Footer />
    </div>
  )
}
