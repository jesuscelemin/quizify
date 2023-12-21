import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LucideLayoutDashboard } from 'lucide-react'
import { auth } from '@/auth'
import HistoryComponent from '@/components/shared/HistoryComponent'

const History = async () => {
  const session = await auth()
  if (!session?.user) {
    return redirect('/')
  }
  return (
    <div className="flex min-h-screen w-[400px] items-center justify-center">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link className={buttonVariants()} href="/dashboard">
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-scroll">
          <HistoryComponent limit={100} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

export default History
