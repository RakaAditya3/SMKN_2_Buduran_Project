import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Dkv from '../DKV'

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Dkv />
      <Footer />
    </div>
  )
}
