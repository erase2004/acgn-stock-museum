import type { APIRoute } from 'astro'
import { z } from 'astro/zod'
import {
  schemaRound,
  badRequest,
  internalServerError,
  getQuery,
  createJSONResponse,
} from '@/libs/api'
import { getConnection } from '@/libs/databases'
import { getArchivedCompany } from '@/services/dbCompanyArchive'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  companyId: z.string(),
})

export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, companyId } = input
  const connection = getConnection(round)

  try {
    const result = await getArchivedCompany(connection, companyId)

    return createJSONResponse(result)
  } catch (err) {
    // TODO: add log format
    console.error(err)

    return internalServerError
  }
}
