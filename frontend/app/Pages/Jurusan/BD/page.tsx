import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'
import Bd from '../BD'

export default function RplPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Bd />
      <Footer />
    </div>
  )
}
