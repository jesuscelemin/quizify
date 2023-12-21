import { auth } from '@/auth'
import Link from 'next/link'
import SignInButton from './SignInButton'
import UserAccount from './UserAccount'
import { ThemeToggle } from './ThemeToggle'

const Navbar = async () => {
  const session = await auth()

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-white py-2 dark:bg-gray-950">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8 ">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:translate-y-[-2px] dark:border-white dark:text-white md:block">
            Quizify
          </p>
        </Link>

        <div className="flex items-center">
          <ThemeToggle className='mr-3'/>

          <div className="flex items-center">
            {session?.user ? (
              <UserAccount user={session.user} />
            ) : (
              <SignInButton text="Sign In" provider="github" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Navbar
