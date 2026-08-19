'use server'

import { auth } from '../_lib/auth'
import { db } from '../_lib/prisma'

export const getConcludedBookings = async () => {
  const session = await auth()
  if (!session?.user) return []
  return db.booking.findMany({
    where: {
      userId: (session.user as { id: string }).id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
}
