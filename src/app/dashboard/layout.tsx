import Navbar from '@/components/layout/DashboardNavbar'
import DashboardSidebar from '../../components/layout/DashboardSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import StatsRow from '@/components/layout/StatsRow'
import { Toaster } from '@/components/ui/sonner'

function DashboardLayout({ children }: { children: React.ReactNode }) {    
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className='md:flex md:justify-between md:items-start'>
        <DashboardSidebar />
        <div className='md:grid md:grid-cols-3 md:gap-8 w-full md:px-8 md:border-t md:border-l border-gray-400 p-3 sm:p-6'>
          <div className='md:col-span-2 flex flex-col md:gap-6 w-full md:py-8'>

            <StatsRow/>
            {children}

          </div>
          <div className='md:col-span-1'>
            <RightSidebar/>
          </div>

        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default DashboardLayout
