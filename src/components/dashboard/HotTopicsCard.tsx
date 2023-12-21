import prisma from '@/lib/prismadb'
import WordCloud from '../shared/WordCloud'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../ui/card'

const HotTopicsCard = async () => {
  const topics = await prisma.topicCount.findMany({})
  const formattedTopics = topics.map(topic => {
    return {
      text: topic.topic,
      value: topic.count
    }
  })

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <WordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  )
}
export default HotTopicsCard
