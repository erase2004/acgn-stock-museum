import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBUserArchive, schema as schemaUserArchive } from '@/services/dbUserArchive'
import { handlePromiseParser } from '@/utils/helpers'
import { createJSONResponse } from '@/libs/api'
import { rounds } from '@/configs/sites'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  const schema = schemaUserArchive.pick({
    _id: true,
    name: true,
    status: true,
    validateType: true,
  })

  const dbUserArchive = getDBUserArchive(connection)
  const userArchiveList =
    (await handlePromiseParser(
      z.promise(schema.array()).parse(dbUserArchive.find({}).toArray()),
    )) ?? []

  return createJSONResponse(userArchiveList)
}

export const getStaticPaths = (() => {
  return rounds.map((round) => ({
    params: {
      round,
    },
  }))
}) satisfies GetStaticPaths
