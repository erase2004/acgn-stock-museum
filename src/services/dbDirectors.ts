// 公司持股董事資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'
import { integer, itemId } from './schema'
import { schema as schemaCompany } from './dbCompanies'

export const schema = z.object({
  /** 公司 ID */
  companyId: itemId,
  /** 董事 user ID */
  userId: itemId,
  /** 擁有股份 */
  stocks: integer.min(1),
  /** 要在董事會成員裡留的言 */
  message: z.string().max(100).optional(),
})

export function getDBDirectors(db: Db) {
  return db.collection('directors')
}

export const stockSchemaExtendWithCompany = schema.merge(
  schemaCompany.pick({ companyName: true, isSeal: true }),
)

export async function getAccountOwnStocks(db: Db, userId: string) {
  const dbDirectors = getDBDirectors(db)

  return handlePromiseParser(
    z.promise(stockSchemaExtendWithCompany.array()).parse(
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
            $sort: {
              isSeal: 1,
              createdAt: -1,
            },
          },
        ])
        .toArray(),
    ),
  )
}
