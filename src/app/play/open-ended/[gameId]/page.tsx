import { auth } from '@/auth'
import OpenEnded from '@/components/shared/OpenEnded'
import prisma from '@/lib/prismadb'
import { OpenEndedPageProps } from '@/types'

import { redirect } from 'next/navigation'

const OpenEndedPage = async ({ params: { gameId } }: OpenEndedPageProps) => {
  const session = await auth()
  if (!session?.user) {
    return redirect('/')
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true
        }
      }
    }
  })
  if (!game || game.gameType !== 'open_ended') {
    return redirect('/quiz')
  }
  return <OpenEnded game={game} />
}
export default OpenEndedPage
