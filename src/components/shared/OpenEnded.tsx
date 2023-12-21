'use client'

import { cn, formatTimeDelta } from '@/lib/utils'
import { OpenendedProps } from '@/types'
import { differenceInSeconds } from 'date-fns'
import { Timer, Loader2, ChevronRight, BarChart, Link } from 'lucide-react'
import { Button, buttonVariants } from '../ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { checkAnswerSchema, endGameSchema } from '@/schemas/questions'
import axios from 'axios'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import BlankAnswerInput from './BlankAnswerInput'
import OpenEndedPercentage from './OpenEndedPercentage'

const OpenEnded = ({ game }: OpenendedProps) => {
  const [hasEnded, setHasEnded] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [blankAnswer, setBlankAnswer] = useState('')
  const [averagePercentage, setAveragePercentage] = useState(0)
  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex]
  }, [questionIndex, game.questions])

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id
      }
      const response = await axios.post(`/api/endGame`, payload)
      return response.data
    }
  })

  const { toast } = useToast()
  const [now, setNow] = useState(new Date())
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer
      document.querySelectorAll('#user-blank-input').forEach((input: any) => {
        filledAnswer = filledAnswer.replace('_____', input.value)
        input.value = ''
      })
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer
      }
      const response = await axios.post(`/api/checkAnswer`, payload)
      return response.data
    }
  })
  useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => {
        setNow(new Date())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [hasEnded])

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`
        })
        setAveragePercentage(prev => {
          return (prev + percentageSimilar) / (questionIndex + 1)
        })
        if (questionIndex === game.questions.length - 1) {
          endGame()
          setHasEnded(true)
          return
        }
        setQuestionIndex(prev => prev + 1)
      },
      onError: error => {
        console.error(error)
        toast({
          title: 'Something went wrong',
          variant: 'destructive'
        })
      }
    })
  }, [checkAnswer, questionIndex, toast, endGame, game.questions.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (key === 'Enter') {
        handleNext()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext])

  if (hasEnded) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center">
        <div className="mt-2 whitespace-nowrap rounded-md bg-green-500 px-4 py-2 font-semibold text-white">
          You Completed in{' '}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: 'lg' }), 'mt-2')}
        >
          View Statistics
          <BarChart className="ml-2 h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-slate-400">Topic</span> &nbsp;
            <span className="rounded-lg bg-slate-800 px-2 py-1 text-white">
              {game.topic}
            </span>
          </p>
          <div className="mt-3 flex self-start text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <OpenEndedPercentage percentage={averagePercentage} />
      </div>
      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 divide-y divide-zinc-600/50 text-center">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        />
        <Button
          variant="outline"
          className="mt-4"
          disabled={isChecking || hasEnded}
          onClick={() => {
            handleNext()
          }}
        >
          {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
export default OpenEnded
