import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { handlePromiseParser, isLatestRound } from '@/utils/helpers'
import { rounds } from '@/configs/sites'
import { getCurrentRound } from '@/services/dbRound'
import { fscLogTypeList, getDBLog, schema } from '@/services/dbLog'
import { badRequest } from '@/libs/api'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  if (!round) return badRequest

  const filterRule = {
    logType: {
      $in: fscLogTypeList,
    },
  }

  if (!isLatestRound(round)) {
    const roundData = await getCurrentRound(connection)

    Object.assign(filterRule, {
      createdAt: {
        $gte: roundData!.beginDate,
        $lt: roundData!.endDate,
      },
    })
  }

  const dbLog = getDBLog(connection)
  const fscLogs =
    (await handlePromiseParser(
      z.promise(schema.array()).parse(
        dbLog
          .find(filterRule, {
            sort: {
              createdAt: -1,
            },
          })
          .toArray(),
      ),
    )) ?? []

  return new Response(`export const data = ${JSON.stringify(fscLogs)}`, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=604800',
    },
  })
}

export const getStaticPaths = (() => {
  return rounds.map((round) => ({
    params: {
      round,
    },
  }))
}) satisfies GetStaticPaths
