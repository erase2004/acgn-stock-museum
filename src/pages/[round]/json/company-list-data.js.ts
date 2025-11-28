import type { APIRoute, GetStaticPaths } from 'astro'
import type { ListItem } from '@/stores/company'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBEmployees, schema as schemaEmployee } from '@/services/dbEmployees'
import { getCompanies } from '@/services/dbCompanies'
import { handlePromiseParser } from '@/utils/helpers'
import { FIRST_ROUND, rounds } from '@/configs/sites'
import { countBy } from 'lodash-es'
import { getCompanyEPS, getCompanyEPSForFirstRound } from '@/utils/company'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  const employeeMap = await (async function () {
    const dbEmployees = getDBEmployees(connection)

    const schema = schemaEmployee.pick({ companyId: true })
    const employees =
      (await handlePromiseParser(
        z.promise(schema.array()).parse(
          dbEmployees
            .find({
              employed: true,
              resigned: false,
            })
            .project({
              companyId: 1,
            })
            .toArray(),
        ),
      )) ?? []

    return countBy(employees, (item) => item.companyId)
  })()

  const isFirstRound = round === FIRST_ROUND

  const companies = (await getCompanies(connection)) ?? []
  const data: ListItem[] = companies.map((company) => {
    const employeeCount = employeeMap[company._id] || 0
    const eps = isFirstRound
      ? getCompanyEPSForFirstRound({ ...company, employeeCount })
      : getCompanyEPS({ ...company, employeeCount })

    return {
      ...company,
      employeeCount,
      eps,
    }
  })

  return new Response(`export const data = ${JSON.stringify(data)}`, {
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
