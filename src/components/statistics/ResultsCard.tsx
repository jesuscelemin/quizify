import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResultCardProps } from '@/types'
import { Award, Trophy } from 'lucide-react'

const ResultsCard = ({ accuracy }: ResultCardProps) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex h-3/5 flex-col items-center justify-center">
        {accuracy > 75 ? (
          <>
            <Trophy className="mr-4" stroke="gold" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-400">
              <span className="">Impressive!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                {'> 75% accuracy'}
              </span>
            </div>
          </>
        ) : accuracy > 25 ? (
          <>
            <Trophy className="mr-4" stroke="silver" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-stone-400">
              <span className="">Good job!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                {'> 25% accuracy'}
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="mr-4" stroke="brown" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-800">
              <span className="">Nice try!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                {'< 25% accuracy'}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ResultsCard
