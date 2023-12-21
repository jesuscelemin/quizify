import prisma from '@/lib/prismadb'
import { HistoryComponentProps } from '@/types'
import { CopyCheck, Edit2, Link, Clock } from 'lucide-react'

const HistoryComponent = async ({ limit, userId }: HistoryComponentProps) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId
    },
    orderBy: {
      timeStarted: 'desc'
    }
  })
  return (
    <div className="space-y-8">
      {games.map(game => {
        return (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === 'mcq' ? (
                <CopyCheck className="mr-3" />
              ) : (
                <Edit2 className="mr-3" />
              )}
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <p className="flex w-fit items-center rounded-lg bg-slate-800 px-2 py-1 text-xs text-white">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {game.gameType === 'mcq' ? 'Multiple Choice' : 'Open-Ended'}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HistoryComponent
