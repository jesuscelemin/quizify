'use client'

import { quizCreationSchema } from '@/schemas/form/quiz'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { BookOpen, CopyCheck } from 'lucide-react'
import { Separator } from '../ui/separator'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LoadingQuestions from '../shared/LoadingQuestions'
import { QuizCreationProps } from '@/types'

const QuizCreation = ({ topicParam }: QuizCreationProps) => {
  const router = useRouter()
  const [showLoader, setShowLoader] = useState(false)
  const [finished, setFinished] = useState(false)
  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({
      amount,
      topic,
      type
    }: z.infer<typeof quizCreationSchema>) => {
      const response = await axios.post('/api/game', {
        amount,
        topic,
        type
      })
      return response.data
    }
  })

  const form = useForm<z.infer<typeof quizCreationSchema>>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParam,
      type: 'open_ended'
    }
  })

  const onSubmit = (values: z.infer<typeof quizCreationSchema>) => {
    setShowLoader(true)
    getQuestions(
      {
        amount: values.amount,
        topic: values.topic,
        type: values.type
      },
      {
        onSuccess: ({ gameId }) => {
          setFinished(true)
          setTimeout(() => {
            if (form.getValues('type') === 'open_ended') {
              router.push(`/play/open_ended/${gameId}`)
            } else {
              router.push(`/play/mcq/${gameId}`)
            }
          }, 1000)
        },
        onError: () => {
          setShowLoader(false)
        }
      }
    )
  }

  form.watch()

  if (showLoader) {
    return <LoadingQuestions finished={finished} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic..." {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an amount..."
                        {...field}
                        type="number"
                        min={1}
                        max={10}
                        onChange={e => {
                          form.setValue('amount', parseInt(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue('type', 'mcq')
                  }}
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                >
                  <CopyCheck className="mr-2 h-4 w-4" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue('type', 'open_ended')
                  }}
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Open Ended
                </Button>
              </div>
              <Button disabled={isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
export default QuizCreation
