import Navbar from '@/components/Navbar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* static navigation for all protected path */}
      <Navbar />
      {children}
    </div>
  )
}

export default DashboardLayout
