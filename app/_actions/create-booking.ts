'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '../_lib/auth'
import { db } from '../_lib/prisma'

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Usuário não autenticado')
  }
  await db.booking.create({
    data: { ...params, userId: (session.user as { id: string }).id },
  })
  revalidatePath('/barbershops/[id]')
  revalidatePath('/bookings')
}
