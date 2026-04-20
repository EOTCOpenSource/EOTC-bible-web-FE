import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { PlansExploreClient } from '@/components/plans/explore/PlansExploreClient'

export default function PlansExplorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="w-full pt-24">
        <PlansExploreClient />
      </main>
      <Footer />
    </div>
  )
}
