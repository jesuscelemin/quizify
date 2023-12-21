import { auth } from "@/auth"
import QuizCreation from "@/components/forms/QuizCreation"
import { QuizPageProps } from "@/types"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Quiz | Quizify',
}

const QuizPage = async ({searchParams}: QuizPageProps) => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/')
  }
  return (
    <QuizCreation topicParam={searchParams.topic ?? ''} />
  )
}
export default QuizPage