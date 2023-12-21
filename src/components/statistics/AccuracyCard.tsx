import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { AccuracyProps } from '@/types'

const AccuracyCard = ({ accuracy }: AccuracyProps) => {
  accuracy = Math.round(accuracy * 100) / 100
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Average Accuracy</CardTitle>
        <Target />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{accuracy.toString() + '%'}</div>
      </CardContent>
    </Card>
  )
}

export default AccuracyCard
