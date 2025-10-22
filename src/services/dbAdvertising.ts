// 廣告資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'

export const schema = z.object({
  /** 廣告者的帳號ID */
  userId: z.string(),
  /** 廣告付費額度 */
  paid: z.number().int().min(0),
  /** 廣告訊息 */
  message: z.string().min(1),
  /** 廣告連結 */
  url: z.string().url().optional(),
  /** 申請廣告日期 */
  createdAt: z.coerce.date(),
})

export function getDBAdvertising(db: Db) {
  return db.collection('advertising')
}

export async function getAdvertisements(db: Db) {
  const dbAdvertising = getDBAdvertising(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbAdvertising
        .find(
          {},
          {
            sort: {
              paid: -1,
            },
          },
        )
        .toArray(),
    ),
  )
}
