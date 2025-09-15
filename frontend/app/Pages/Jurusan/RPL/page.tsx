import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Rpl from '../RPL'

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Rpl />
      <Footer />
    </div>
  )
}
