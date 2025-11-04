import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBDirectors, schema as schemaDirector } from '@/services/dbDirectors'
import { handlePromiseParser } from '@/utils/helpers'
import { createJSONResponse } from '@/libs/api'
import { rounds } from '@/configs/sites'
import { entries, groupBy, pick } from 'lodash-es'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  const schema = schemaDirector
    .pick({
      userId: true,
      companyId: true,
      stocks: true,
    })
    // 縮短 key，減少輸出的檔案尺寸
    .transform((value) => ({ u: value.userId, c: value.companyId, s: value.stocks }))

  const dbDirectors = getDBDirectors(connection)
  const ownStockList =
    (await handlePromiseParser(z.promise(schema.array()).parse(dbDirectors.find({}).toArray()))) ??
    []

  const ownStockMap = groupBy(ownStockList, 'u')
  const minifiedMap = entries(ownStockMap).reduce(
    (map, [userId, values]) => {
      map[userId] = values.map((v) => pick(v, ['c', 's']))
      return map
    },
    {} as Record<string, { c: string; s: number }[]>,
  )

  return createJSONResponse(minifiedMap)
}

export const getStaticPaths = (() => {
  return rounds.map((round) => ({
    params: {
      round,
    },
  }))
}) satisfies GetStaticPaths
