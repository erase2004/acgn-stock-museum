import type { Db } from 'mongodb'
import { z } from 'astro/zod'

export const schema = z.object({
  /** 公司 ID */
  companyId: z.string(),
  /** 董事 user ID */
  userId: z.string(),
  /** 擁有股份 */
  stocks: z.number().int().min(1),
})

export function getDBDirectors(db: Db) {
  return db.collection('directors')
}

export const stocksWithCountSchema = z
  .object({
    total: z
      .object({
        total: z.number().int(),
      })
      .array()
      .max(1),
    data: schema.array(),
  })
  .array()

export async function getAccountOwnStocks(db: Db, userId: string, size: number, page: number = 1) {
  const dbDirectors = getDBDirectors(db)

  const result = await z.promise(stocksWithCountSchema).parse(
    dbDirectors
      .aggregate([
        {
          $match: {
            userId: {
              $eq: userId,
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $facet: {
            total: [{ $count: 'total' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        },
      ])
      .toArray(),
  )

  return result
}
