import { signIn } from '@/auth'
import { Button } from '../ui/button'

const SignInButton = ({
  text,
  provider
}: {
  text: string
  provider: string
}) => {
  return (
    <form
      className="flex w-full justify-center"
      action={async () => {
        'use server'
        await signIn(provider)
      }}
    >
      <Button>{text}</Button>
    </form>
  )
}
export default SignInButton
