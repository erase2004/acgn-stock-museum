import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBCompanyArchive, schema as schemaCompanyArchive } from '@/services/dbCompanyArchive'
import { handlePromiseParser } from '@/utils/helpers'
import { rounds } from '@/configs/sites'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  const schema = schemaCompanyArchive
    .pick({
      _id: true,
      companyName: true,
      status: true,
    })
    // 縮短 key，減少輸出的檔案尺寸
    .transform((value) => ({ u: value._id, c: value.companyName, s: value.status }))

  const dbCompanyArchive = getDBCompanyArchive(connection)
  const companyArchiveList =
    (await handlePromiseParser(
      z.promise(schema.array()).parse(dbCompanyArchive.find({}).toArray()),
    )) ?? []

  return new Response(`export const data = ${JSON.stringify(companyArchiveList)}`, {
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
