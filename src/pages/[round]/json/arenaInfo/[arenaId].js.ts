import type { APIRoute, GetStaticPaths } from 'astro'
import { getConnection } from '@/libs/databases'
import { rounds } from '@/configs/sites'
import { flatten } from 'lodash-es'
import { getArenaLogs } from '@/services/dbArenaLog'
import { badRequest } from '@/libs/api'
import { getAllArenas } from '@/services/dbArena'

export const GET: APIRoute = async ({ params }) => {
  const { round, arenaId } = params
  const connection = getConnection(round!)

  if (!arenaId) return badRequest

  const logs = (await getArenaLogs(connection, arenaId)) ?? []

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
      const arenas = (await getAllArenas(connection)) ?? []

      return arenas.map((arena) => ({
        params: {
          round,
          arenaId: arena._id,
        },
      }))
    }),
  )

  return flatten(
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value),
  )
}) satisfies GetStaticPaths
