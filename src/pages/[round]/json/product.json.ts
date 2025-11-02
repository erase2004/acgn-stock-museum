import type { APIRoute, GetStaticPaths } from 'astro'
import { z } from 'astro/zod'
import { getConnection } from '@/libs/databases'
import { getDBProducts, schema as schemaProduct } from '@/services/dbProducts'
import { handlePromiseParser } from '@/utils/helpers'
import { createJSONResponse } from '@/libs/api'
import { rounds } from '@/configs/sites'

export const GET: APIRoute = async ({ params }) => {
  const round = params.round
  const connection = getConnection(round!)

  const schema = schemaProduct.pick({
    _id: true,
    productName: true,
    type: true,
    url: true,
  })

  const dbProducts = getDBProducts(connection)
  const productList =
    (await handlePromiseParser(z.promise(schema.array()).parse(dbProducts.find({}).toArray()))) ??
    []

  return createJSONResponse(productList)
}

export const getStaticPaths = (() => {
  return rounds.map((round) => ({
    params: {
      round,
    },
  }))
}) satisfies GetStaticPaths
