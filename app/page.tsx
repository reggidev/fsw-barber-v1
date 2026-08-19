import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

import BarbershopItem from './_components/barbershop-item'
import BookingItem from './_components/booking-item'
import Header from './_components/header'
import Search from './_components/search'
import { Button } from './_components/ui/button'
import { quickSearchOptions } from './_constants/search'
import { getConfirmedBookings } from './_data/get-confirmed-bookings'
import { auth } from './_lib/auth'
import { db } from './_lib/prisma'

const Home = async () => {
  const session = await auth()
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: 'desc',
    },
  })
  const confirmedBookings = await getConfirmedBookings()

  return (
    <>
      <Header />
      <div className="container p-5">
        <h2 className="text-xl font-bold md:text-center">
          Olá, {session?.user ? session.user.name : 'bem vindo'}!
        </h2>
        <p className="md:text-center">
          <span className="capitalize">
            {format(new Date(), 'EEEE, dd', { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), 'MMMM', { locale: ptBR })}
          </span>
        </p>

        {/* Search Form */}
        <div className="mt-6">
          <Search />
        </div>

        {/* Quick search */}
        <div className="mt-6 flex gap-3 overflow-x-scroll md:justify-center [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.title}
              className="gap-2"
              variant="secondary"
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  height={16}
                  width={16}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* Image */}
        <div className="relative mt-6 h-[150px] w-full md:hidden">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Seus agendamentos
            </h2>

            {/* Booking */}
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={JSON.parse(JSON.stringify(booking))}
                />
              ))}
            </div>
          </>
        )}

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
