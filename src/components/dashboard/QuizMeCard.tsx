import { BrainCircuit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const QuizMeCard = () => {
  return (
    <Card className="hover:cursor-pointer hover:opacity-75">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className='text-2xl font-bold'>Quiz me!</CardTitle>
        <BrainCircuit size={28} strokeWidth={2.5} />
      </CardHeader>

      <CardContent>
        <p className='text-sm text-muted-foreground'>
          Challenge yourself with a quiz!
        </p>
      </CardContent>
    </Card>
  )
}
export default QuizMeCard
