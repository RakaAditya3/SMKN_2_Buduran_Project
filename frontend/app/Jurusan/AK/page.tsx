import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Ak from '@/app/Jurusan/AK'  // ini file RPL.tsx yang sudah ada

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Ak />
      <Footer />
    </div>
  )
}
