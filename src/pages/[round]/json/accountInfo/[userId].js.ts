import type { APIRoute, GetStaticPaths } from 'astro'
import { getConnection } from '@/libs/databases'
import { rounds } from '@/configs/sites'
import { getAllBasicUsers } from '@/services/dbUsers'
import { flatten } from 'lodash-es'
import { getCurrentRound } from '@/services/dbRound'
import { getAccountLogs } from '@/services/dbLog'
import { badRequest } from '@/libs/api'

export const GET: APIRoute = async ({ params }) => {
  const { round, userId } = params
  const connection = getConnection(round!)
  const roundData = await getCurrentRound(connection)

  if (!userId) return badRequest

  const logs = (await getAccountLogs(connection, userId, roundData!.beginDate)) ?? []

  return new Response(`export const data = ${JSON.stringify(logs)}`, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=604800',
    },
  })
}

export const getStaticPaths = (async () => {
  const results = await Promise.allSettled(
    rounds.map(async (round) => {
      const connection = getConnection(round)!
      const users = (await getAllBasicUsers(connection)) ?? []

      return users.map((user) => ({
        params: {
          round,
          userId: user._id,
        },
      }))
    }),
  )

  return flatten(
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value),
  )
}) satisfies GetStaticPaths
