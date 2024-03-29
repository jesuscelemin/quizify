/* eslint-disable camelcase */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import prisma from '@/lib/prismadb'
import HistoryComponent from '../shared/HistoryComponent'

const RecentActivityCard = async () => {
  const session = await auth()
  if (!session?.user) {
    return redirect('/')
  }
  const games_count = await prisma.game.count({
    where: {
      userId: session.user.id
    }
  })

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of {games_count} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-x-auto overflow-y-hidden">
        <HistoryComponent limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  )
}

export default RecentActivityCard
