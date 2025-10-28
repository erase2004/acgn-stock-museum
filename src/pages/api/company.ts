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
import { itemId } from '@/services/schema'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  companyId: itemId,
})

export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, companyId } = input
  const connection = getConnection(round)

  const result = await getArchivedCompany(connection, companyId)

  if (typeof result === 'undefined') return internalServerError
  return createJSONResponse(result)
}
