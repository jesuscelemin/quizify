import { auth } from '@/auth'
import MCQ from '@/components/shared/MCQ'
import prisma from '@/lib/prismadb'
import { MCQPageProps } from '@/types'
import { redirect } from 'next/navigation'

const MCQPage = async ({ params: { gameId } }: MCQPageProps) => {
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
          options: true
        }
      }
    }
  })
  if (!game || game.gameType !== 'mcq') {
    return redirect('/quiz')
  }
  return <MCQ game={game} />
}
export default MCQPage
