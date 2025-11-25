import Navbar from '@/components/layout/DashboardNavbar'
import DashboardSidebar from '../../components/layout/DashboardSidebar'
import RightSidebar from '@/components/layout/RightSidebar'
import StatsRow from '@/components/layout/StatsRow'

function DashboardLayout({ children }: { children: React.ReactNode }) {    
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className='flex justify-between items-start'>
        <DashboardSidebar />
        <div className='flex justify-start items-start gap-8 w-full px-8 border-t border-l border-gray-400'>
          <div className='flex flex-col gap-6 w-full py-8'>

            <StatsRow/>
            {children}

          </div>
          <RightSidebar/>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
