import { auth } from '@/auth'
import HistoryCard from '@/components/dashboard/HistoryCard'
import HotTopicsCard from '@/components/dashboard/HotTopicsCard'
import QuizMeCard from '@/components/dashboard/QuizMeCard'
import RecentActivityCard from '@/components/dashboard/RecentActivityCard'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | Quizify'
}

const Dashboard = async () => {
  const session = await auth()
  if (!session?.user) {
    return redirect('/')
  }

  return (
    <main className="mx-auto mt-[60px] max-w-7xl p-8">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  )
}
export default Dashboard
