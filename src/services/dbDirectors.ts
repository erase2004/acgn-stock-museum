// 公司持股董事資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'
import { integer, itemId, withCountSchema } from './schema'

export const schema = z.object({
  /** 公司 ID */
  companyId: itemId,
  /** 董事 user ID */
  userId: itemId,
  /** 擁有股份 */
  stocks: integer.min(1),
})

export function getDBDirectors(db: Db) {
  return db.collection('directors')
}

export const stocksWithCountSchema = withCountSchema(schema)

export async function getAccountOwnStocks(db: Db, userId: string, includeSeal: boolean = false) {
  const dbDirectors = getDBDirectors(db)

  if (!includeSeal) {
    return handlePromiseParser(
      z.promise(stocksWithCountSchema).parse(
        dbDirectors
          .aggregate([
            {
              $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'companyInfo',
              },
            },
            {
              $replaceRoot: {
                newRoot: { $mergeObjects: [{ $arrayElemAt: ['$companyInfo', 0] }, '$$ROOT'] },
              },
            },
            { $project: { fromItems: 0 } },
            {
              $match: {
                userId: {
                  $eq: userId,
                },
                isSeal: false,
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
                data: [],
              },
            },
          ])
          .toArray(),
      ),
    )
  }

  return handlePromiseParser(
    z.promise(stocksWithCountSchema).parse(
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
              data: [],
            },
          },
        ])
        .toArray(),
    ),
  )
}
