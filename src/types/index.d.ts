import { Game, Question } from '@prisma/client'
import { User } from 'next-auth'
import React from 'react'

export type UserAccountProps = {
  user: Pick<User, 'name' | 'image' | 'email'>
}

export type AvatarProps = {
  user: Pick<User, 'name' | 'image'>
}

export type MCQPageProps = {
  params: {
    gameId: string
  }
}

export type MCQProps = {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] }
}

export type MCQCounterProps = {
  correctAnswers: number
  wrongAnswers: number
}

export type OpenEndedPageProps = {
  params: {
    gameId: string
  }
}

export type OpenendedProps = {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer'>[] }
}

export type BlankAnswerInputProps = {
  answer: string
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>
}

export type OpenEndedPercentageProps = {
  percentage: number
}

export type StatisticsPageProps = {
  params: {
    gameId: string
  }
}

export type ResultCardProps = { accuracy: number }

export type TimeTakenCardProps = {
  timeEnded: Date
  timeStarted: Date
}

export type AccuracyProps = {
  accuracy: number
}

export type QuestionsListProps = {
  questions: Question[]
}

export type LoadingQuestionsProps = { finished: boolean }

export type HistoryComponentProps = {
  limit: number
  userId: string
}

export type WordCloudProps = {
  formattedTopics: { text: string; value: number }[]
}

export type QuizPageProps = {
  searchParams: {
    topic?: string
  }
}

export type QuizCreationProps = {
  topicParam: string
}
