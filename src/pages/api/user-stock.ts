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
import { getDBDirectors, simpleSchema } from '@/services/dbDirectors'
import { itemId } from '@/services/schema'
import { handlePromiseParser } from '@/utils/helpers'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  userId: itemId,
})

export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, userId } = input
  const connection = getConnection(round)
  const dbDirectors = getDBDirectors(connection)

  const result = await handlePromiseParser(
    z.promise(simpleSchema.array()).parse(
      dbDirectors
        .find(
          {
            userId,
          },
          // @ts-expect-error: companyId field exists
          { companyId: 1, stocks: 1 },
        )
        .toArray(),
    ),
  )

  if (typeof result === 'undefined') return internalServerError
  return createJSONResponse(result)
}
