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
import { getProduct } from '@/services/dbProducts'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  productId: z.string(),
})

export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, productId } = input
  const connection = getConnection(round)

  try {
    const result = await getProduct(connection, productId)

    return createJSONResponse(result)
  } catch (err) {
    // TODO: add log format
    console.error(err)

    return internalServerError
  }
}
