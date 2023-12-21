import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { MCQCounterProps } from '@/types'

const MCQCounter = ({correctAnswers, wrongAnswers}: MCQCounterProps) => {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <CheckCircle2 color="green" size={24} />
      <span className="mx-2 text-xl text-[green]">{correctAnswers}</span>
      <Separator orientation="vertical" />
      <span className="mx-2 text-xl text-[red]">{wrongAnswers}</span>
      <XCircle color="red" size={24} />
    </Card>
  )
}
export default MCQCounter
