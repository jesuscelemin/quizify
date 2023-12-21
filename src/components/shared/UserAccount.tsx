'use client'

import { UserAccountProps } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'
import { DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import UserAvatar from './UserAvatar'

const UserAccount = ({ user }: UserAccountProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none'>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border border-zinc-300 bg-white dark:bg-black"
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">Meow</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={e => {
            e.preventDefault()
            signOut()
          }}
          className="cursor-pointer text-red-600"
        >
          Sign out
          <LogOut className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserAccount
