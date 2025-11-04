import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBUserOwnedProduct, schema as schemaOwnProduct } from '@/services/dbUserOwnedProduct'
import { handlePromiseParser } from '@/utils/helpers'
import { createJSONResponse } from '@/libs/api'
import { rounds } from '@/configs/sites'
import { getLatestSeason } from '@/services/dbSeason'
import { entries, groupBy } from 'lodash-es'

export const GET: APIRoute = async ({ params }) => {
  const schema = schemaOwnProduct.pick({
    userId: true,
    companyId: true,
    price: true,
    amount: true,
  })

  const round = params.round
  const connection = getConnection(round!)

  const season = await getLatestSeason(connection)
  const dbUserOwnedProduct = getDBUserOwnedProduct(connection)
  const list = await handlePromiseParser(
    z.promise(schema.array()).parse(dbUserOwnedProduct.find({ seasonId: season!._id }).toArray()),
  )
  const rawDict = groupBy(list, 'userId')
  const finalDict = entries(rawDict).reduce(
    (userMap, [userId, items]) => {
      userMap[userId] = items.reduce(
        (totalMap, item) => {
          const companyId = item.companyId

          if (!(companyId in totalMap)) {
            totalMap[companyId] = 0
          }
          totalMap[companyId] += item.price * item.amount
          return totalMap
        },
        {} as Record<string, number>,
      )

      return userMap
    },
    {} as Record<string, Record<string, number>>,
  )

  return createJSONResponse(finalDict)
}

export const getStaticPaths = (() => {
  return rounds.map((round) => ({
    params: {
      round,
    },
  }))
}) satisfies GetStaticPaths
