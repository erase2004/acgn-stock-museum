// 公司產品資料集
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { integer, itemId, objectId } from './schema'

const productTypeList = ['未分類', '繪圖', 'ANSI', '影音', '文字', '三次元'] as const

const productRatingList = ['一般向', '18禁'] as const

// 產品補貨的基準值方案
const productReplenishBaseAmountTypeList = ['stockAmount', 'totalAmount'] as const

export function productReplenishBaseAmountTypeDisplayName(
  value: (typeof productReplenishBaseAmountTypeList)[number],
) {
  switch (value) {
    case 'stockAmount':
      return '庫存數'
    case 'totalAmount':
      return '總數'
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = value
      return value
    }
  }
}

// 產品補貨的速度方案
const productReplenishBatchSizeTypeList = [
  'verySmall',
  'small',
  'medium',
  'large',
  'veryLarge',
] as const

export function productReplenishBatchSizeTypeDisplayName(
  value: (typeof productReplenishBatchSizeTypeList)[number],
) {
  switch (value) {
    case 'verySmall':
      return '極少量'
    case 'small':
      return '少量'
    case 'medium':
      return '中量'
    case 'large':
      return '大量'
    case 'veryLarge':
      return '極大量'
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = value
      return value
    }
  }
}

export const schema = z.object({
  _id: objectId,
  /** 產品名稱 */
  productName: z.string().min(4).max(255),
  /** 公司 ID */
  companyId: itemId,
  /** 產品類別 */
  type: z.enum(productTypeList),
  /** 產品連結 */
  url: z.string().url(),
  /** 產品分級 */
  rating: z.enum(productRatingList),
  /** 產品描述 */
  description: z.string().max(500).nullish(),
  /** 推薦票的總票數 */
  voteCount: integer.default(0),
  /** 產品售價 */
  price: integer.min(1),
  /** 產品發行總數 */
  totalAmount: integer.min(1),
  /** 庫存（未上貨架）的產品總數 */
  stockAmount: integer.min(0).default(0),
  /** 現貨（可購買）的產品總數 */
  availableAmount: integer.min(0).default(0),
  /** 產品補貨的基準值設定 */
  replenishBaseAmountType: z.enum(productReplenishBaseAmountTypeList),
  /** 產品補貨的批次量大小設定 */
  replenishBatchSizeType: z.enum(productReplenishBatchSizeTypeList),
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
