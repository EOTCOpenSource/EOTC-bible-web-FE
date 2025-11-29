'use clent'

import DashboardWidget from '../../components/layout/DashboardWidget'


const StatsRow = () => {
     return (
          <div className='flex gap-1 sm:gap-3 w-full'>
               <DashboardWidget name="Today Reading" amount={2} />
               <DashboardWidget name="Highlight" amount={34} />
               <DashboardWidget name="Notes" amount={45} />
               <DashboardWidget name="Plans" amount={12} />
          </div>
     )
}

export default StatsRow
