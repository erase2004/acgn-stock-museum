// 公司產品資料集
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import type { Db } from 'mongodb'

const productTypeList = ['未分類', '繪圖', 'ANSI', '影音', '文字', '三次元'] as const

const productRatingList = ['一般向', '18禁'] as const

export const schema = z.object({
  _id: z.coerce.string(),
  /** 產品名稱 */
  productName: z.string().min(4).max(255),
  /** 公司 ID */
  companyId: z.string(),
  /** 產品類別 */
  type: z.enum(productTypeList),
  /** 產品連結 */
  url: z.string().url(),
  /** 產品分級 */
  rating: z.enum(productRatingList),
  /** 產品描述 */
  description: z.string().max(500).nullish(),
  /** 推薦票的總票數 */
  voteCount: z.number().int().default(0),
})

export function getDBProducts(db: Db) {
  return db.collection('products')
}

export const basicSchema = schema.pick({
  productName: true,
  type: true,
  url: true,
})

export async function getProductsBySeason(db: Db, seasonId: string) {
  const dbProducts = getDBProducts(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbProducts
        .find(
          { seasonId, state: { $ne: 'planning' } },
          {
            sort: {
              voteCount: -1,
            },
          },
        )
        .toArray(),
    ),
  )
}

export async function getProductsByCompany(db: Db, companyId: string) {
  const dbProducts = getDBProducts(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbProducts
        .find(
          { companyId, state: { $ne: 'planning' } },
          {
            sort: {
              voteCount: -1,
            },
          },
        )
        .toArray(),
    ),
  )
}

export async function getProduct(db: Db, productId: string) {
  const dbProducts = getDBProducts(db)

  return handlePromiseParser(
    z
      .promise(basicSchema)
      // @ts-expect-error: key is valid ObjectId
      .parse(dbProducts.findOne({ _id: productId })),
  )
}
