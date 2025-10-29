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
import { getLatestSeason } from '@/services/dbSeason'
import { getDBUserOwnedProduct } from '@/services/dbUserOwnedProduct'
import { integer, itemId } from '@/services/schema'
import { handlePromiseParser } from '@/utils/helpers'
import { map, zipObject } from 'lodash-es'

export const prerender = false

const schema = z.object({
  round: schemaRound,
  userId: itemId,
})

// 取得使用者在各個公司所花費的產品總額
export const GET: APIRoute = async ({ request }) => {
  const { success, data: input } = schema.safeParse(getQuery(request))

  if (!success) {
    return badRequest
  }
  const { round, userId } = input
  const connection = getConnection(round)
  const season = await getLatestSeason(connection)
  const dbUserOwnedProduct = getDBUserOwnedProduct(connection)

  const _schema = z.object({
    _id: itemId,
    total: integer,
  })

  const result = await handlePromiseParser(
    z.promise(_schema.array()).parse(
      dbUserOwnedProduct
        .aggregate([
          {
            $match: {
              seasonId: season!._id,
              userId,
            },
          },
          {
            $group: {
              _id: '$companyId',
              total: {
                $sum: {
                  $multiply: ['$price', '$amount'],
                },
              },
            },
          },
        ])
        .toArray(),
    ),
  )

  if (typeof result === 'undefined') return internalServerError

  const companyProductTotalMap = zipObject(map(result, '_id'), map(result, 'total'))
  return createJSONResponse(companyProductTotalMap)
}
