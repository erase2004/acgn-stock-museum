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
import { getArchivedUser } from '@/services/dbUserArchive'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  userId: z.string(),
})

export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, userId } = input
  const connection = getConnection(round)

  try {
    const result = await getArchivedUser(connection, userId)

    return createJSONResponse(result)
  } catch (err) {
    // TODO: add log format
    console.error(err)

    return internalServerError
  }
}
