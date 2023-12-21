import React from 'react'
import { Card } from '@/components/ui/card'
import { Percent, Target } from 'lucide-react'
import { OpenEndedPercentageProps } from '@/types'

const OpenEndedPercentage = ({ percentage }: OpenEndedPercentageProps) => {
  return (
    <Card className="flex flex-row items-center p-2">
      <Target size={30} />
      <span className="ml-3 text-2xl opacity-75">{percentage}</span>
      <Percent className="" size={25} />
    </Card>
  )
}

export default OpenEndedPercentage
