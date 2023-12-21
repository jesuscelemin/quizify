import { AvatarProps } from '@/types'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '../ui/avatar'

const UserAvatar = ({ user }: AvatarProps) => {
  return (
    <Avatar>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            src={user.image}
            alt="profile avatar"
            fill
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  )
}
export default UserAvatar
