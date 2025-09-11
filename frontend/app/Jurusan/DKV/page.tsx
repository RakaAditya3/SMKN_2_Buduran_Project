import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Dkv from '@/app/Jurusan/DKV'  // ini file RPL.tsx yang sudah ada

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Dkv />
      <Footer />
    </div>
  )
}
