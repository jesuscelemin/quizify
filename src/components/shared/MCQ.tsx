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
import { checkAnswerSchema } from '@/schemas/questions'
import { useToast } from '../ui/use-toast'
import Link from 'next/link'
import { cn, formatTimeDelta } from '@/lib/utils'
import { differenceInSeconds } from 'date-fns'

const MCQ = ({ game }: MCQProps) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number>(0)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [wrongAnswers, setWrongAnswers] = useState<number>(0)
  const [hasEnded, setHasEnded] = useState<boolean>(false)
  const [now, setNow] = useState<Date>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date())
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [hasEnded])

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex]
  }, [questionIndex, game.questions])

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice]
      }
      const response = await axios.post('/api/checkAnswer', payload)
      return response.data
    }
  })

  const handleNext = useCallback(() => {
    if (isChecking) return
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast({
            title: 'Correct!',
            description: 'Correct answer',
            variant: 'success'
          })
          setCorrectAnswers(prev => prev + 1)
        } else {
          toast({
            title: 'Incorrect!',
            description: 'Incorrect answer',
            variant: 'destructive'
          })
          setWrongAnswers(prev => prev + 1)
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true)
          return
        }
        setQuestionIndex(prev => prev + 1)
      }
    })
  }, [checkAnswer, isChecking, toast, questionIndex, game.questions.length])

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

  const options = useMemo(() => {
    if (!currentQuestion) return []
    if (!currentQuestion.options) return []
    return JSON.parse(currentQuestion.options as string) as string[]
  }, [currentQuestion])

  if (hasEnded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mt-2 whitespace-nowrap rounded-md bg-green-500 px-4 font-semibold text-white">
          You completed in {''}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`statistics/${game.id}`}
          className={cn(buttonVariants(), 'mt-2')}
        >
          View Statistics
          <BarChart className="ml-2 h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-col">
          {/* Topic */}
          <p>
            <span className="mr-2 text-slate-400">Topic</span>
            <span className="rounded-lg bg-slate-800 px-2 py-1 text-white">
              {game.topic}
            </span>
          </p>
          <div className="mt-2 flex items-center text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
        />
      </div>

      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 divide-y divide-zinc-600/50 text-center">
            <div className="text-base">{questionIndex + 1}</div>
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
        {options.map((option, index) => (
          <Button
            key={index}
            className="mb-4 w-full justify-start py-8"
            variant={selectedChoice === index ? 'default' : 'secondary'}
            onClick={() => {
              setSelectedChoice(index)
            }}
          >
            <div className="flex items-center justify-start">
              <div className="mr-5 rounded-md border p-2 px-3">{index + 1}</div>
            </div>
            <div className="text-start">{option}</div>
          </Button>
        ))}
        <Button
          className="mt-2"
          disabled={isChecking}
          onClick={() => {
            handleNext()
          }}
        >
          {isChecking && <Loader2 className="animated-spin mr-2 h-4 w-4" />}
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
export default MCQ
