// 公司產品資料集
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import type { Db } from 'mongodb'

const productTypeList = ['未分類', '繪圖', 'ANSI', '影音', '文字', '三次元'] as const

export const schema = z.object({
  /** 產品名稱 */
  productName: z.string().min(4).max(255),
  /** 公司 ID */
  companyId: z.string(),
  /** 產品類別 */
  type: z.enum(productTypeList),
  /** 產品連結 */
  url: z.string().url(),
})

export function getDBProducts(db: Db) {
  return db.collection('products')
}

export async function getProduct(db: Db, productId: string) {
  const dbProducts = getDBProducts(db)

  return handlePromiseParser(
    z
      .promise(schema)
      // @ts-expect-error: key is valid ObjectId
      .parse(dbProducts.findOne({ _id: productId })),
  )
}
