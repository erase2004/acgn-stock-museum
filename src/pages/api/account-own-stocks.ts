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
import { getAccountOwnStocks } from '@/services/dbDirectors'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  userId: z.string(),
  size: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().optional().default(1),
})

export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, userId, size, page } = input
  const connection = getConnection(round)

  const result = await getAccountOwnStocks(connection, userId, size, page)

  if (typeof result === 'undefined') return internalServerError
  return createJSONResponse(result)
}
