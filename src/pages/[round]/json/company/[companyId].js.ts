import type { APIRoute, GetStaticPaths } from 'astro'
import { getConnection } from '@/libs/databases'
import { rounds } from '@/configs/sites'
import { flatten } from 'lodash-es'
import { getCurrentRound } from '@/services/dbRound'
import { getCompanyLogs } from '@/services/dbLog'
import { badRequest } from '@/libs/api'
import { getAllBasicCompanies } from '@/services/dbCompanies'

export const GET: APIRoute = async ({ params }) => {
  const { round, companyId } = params
  const connection = getConnection(round!)
  const roundData = await getCurrentRound(connection)

  if (!companyId) return badRequest

  const logs = (await getCompanyLogs(connection, companyId, roundData!.beginDate)) ?? []

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
      const companies = (await getAllBasicCompanies(connection)) ?? []

      return companies.map((company) => ({
        params: {
          round,
          companyId: company._id,
        },
      }))
    }),
  )

  return flatten(
    results.filter((result) => result.status === 'fulfilled').map((result) => result.value),
  )
}) satisfies GetStaticPaths
