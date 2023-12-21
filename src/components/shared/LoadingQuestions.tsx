'use client'

import Image from 'next/image'
import { Progress } from '../ui/progress'
import { useEffect, useState } from 'react'
import { LoadingQuestionsProps } from '@/types'

const loadingTexts = [
  'Generating questions...',
  'Unleashing the power of curiosity...',
  'Diving deep into the ocean of questions..',
  'Harnessing the collective knowledge of the cosmos...',
  'Igniting the flame of wonder and exploration...'
]

const LoadingQuestions = ({ finished }: LoadingQuestionsProps) => {
  const [progress, setProgress] = useState(10)
  const [loadingText, setLoadingText] = useState(loadingTexts[0])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length)
      setLoadingText(loadingTexts[randomIndex])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (finished) return 100
        if (prev === 100) {
          return 0
        }
        if (Math.random() < 0.1) {
          return prev + 2
        }
        return prev + 0.5
      })
    }, 100)
    return () => clearInterval(interval)
  }, [finished])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center">
      <Image src={'/loading.gif'} width={400} height={400} alt="loading" />
      <Progress value={progress} className="mt-4 w-full" />
      <h1 className="mt-2 text-xl">{loadingText}</h1>
    </div>
  )
}

export default LoadingQuestions
