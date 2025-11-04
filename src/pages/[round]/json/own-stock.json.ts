import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBDirectors, schema as schemaDirector } from '@/services/dbDirectors'
import { handlePromiseParser } from '@/utils/helpers'
import { createJSONResponse } from '@/libs/api'
import { rounds } from '@/configs/sites'
import { groupBy } from 'lodash-es'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  const schema = schemaDirector.pick({
    userId: true,
    companyId: true,
    stocks: true,
  })

  const dbDirectors = getDBDirectors(connection)
  const ownStockList =
    (await handlePromiseParser(z.promise(schema.array()).parse(dbDirectors.find({}).toArray()))) ??
    []

  const ownStockMap = groupBy(ownStockList, 'userId')

  return createJSONResponse(ownStockMap)
}

export const getStaticPaths = (() => {
  return rounds.map((round) => ({
    params: {
      round,
    },
  }))
}) satisfies GetStaticPaths
