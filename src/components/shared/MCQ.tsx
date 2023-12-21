/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import { MCQProps } from '@/types'
import { Timer, ChevronRight, Loader2, BarChart } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, buttonVariants } from '../ui/button'
import MCQCounter from './MCQCounter'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'
import { checkAnswerSchema, endGameSchema } from '@/schemas/questions'
import { useToast } from '../ui/use-toast'
import Link from 'next/link'
import { cn, formatTimeDelta } from '@/lib/utils'
import { differenceInSeconds } from 'date-fns'

const MCQ = ({ game }: MCQProps) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0
  })
  const [selectedChoice, setSelectedChoice] = useState<number>(0)
  const [now, setNow] = useState(new Date())

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex]
  }, [questionIndex, game.questions])

  const options = useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []
    return JSON.parse(currentQuestion.options as string) as string[]
  }, [currentQuestion])

  const { toast } = useToast()
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice]
      }
      const response = await axios.post(`/api/checkAnswer`, payload)
      return response.data
    }
  })

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id
      }
      const response = await axios.post(`/api/endGame`, payload)
      return response.data
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date())
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [hasEnded])

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats(stats => ({
            ...stats,
            correct_answers: stats.correct_answers + 1
          }))
          toast({
            title: 'Correct',
            description: 'You got it right!',
            variant: 'success'
          })
        } else {
          setStats(stats => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1
          }))
          toast({
            title: 'Incorrect',
            description: 'You got it wrong!',
            variant: 'destructive'
          })
        }
        if (questionIndex === game.questions.length - 1) {
          endGame()
          setHasEnded(true)
          return
        }
        setQuestionIndex(questionIndex => questionIndex + 1)
      }
    })
  }, [checkAnswer, questionIndex, game.questions.length, toast, endGame])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key

      if (key === '1') {
        setSelectedChoice(0)
      } else if (key === '2') {
        setSelectedChoice(1)
      } else if (key === '3') {
        setSelectedChoice(2)
      } else if (key === '4') {
        setSelectedChoice(3)
      } else if (key === 'Enter') {
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
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center">
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
    <div className="absolute left-1/2 top-1/2 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 md:w-[80vw]">
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
        <MCQCounter
          correctAnswers={stats.correct_answers}
          wrongAnswers={stats.wrong_answers}
        />
      </div>
      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 divide-y divide-zinc-600/50 text-center">
            <div className='text-base'>{questionIndex + 1}</div>
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
        {options.map((option, index) => {
          return (
            <Button
              key={option}
              variant={selectedChoice === index ? 'default' : 'outline'}
              className="mb-4 w-full justify-start py-8"
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="mr-5 rounded-md border p-2 px-3">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          )
        })}
        <Button
          variant="default"
          className="mt-2"
          size="lg"
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

export default MCQ
