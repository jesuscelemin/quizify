import { auth } from '@/auth'
import SignInButton from '@/components/shared/SignInButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    return redirect('/dashboard')
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Welcome to Quizify</CardTitle>
          <CardDescription>
            Quizify es a quiz app that allows you to create and share quizz with
            your friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sing In With GitHub" provider="github" />
        </CardContent>
      </Card>
    </div>
  )
}
