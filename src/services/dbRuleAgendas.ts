// 議程資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { schema as schemaRound } from './dbRound'
import { handlePromiseParser } from '@/utils/helpers'

export const schema = z.object({
  _id: z.coerce.string(),
  /** 議程標題 */
  title: z.string().min(1).max(100),
  /** 議程討論 URL */
  discussionUrl: z.string().url(),
  /** 議程建立時間 */
  createdAt: z.coerce.date(),
  /** 議程長度(小時) */
  duration: z.number().int().default(72),
})

export function getDBRuleAgendas(db: Db) {
  return db.collection('ruleAgendas')
}

export const extendedAgendasSchema = schema
  .extend({
    /** 議程結束時間  */
    endedAt: z.coerce.date(),
    /** 議程是否已結束 */
    isEnded: z.boolean(),
  })
  .array()

export async function getAllRuleAgendas(db: Db, currentRound: z.infer<typeof schemaRound>) {
  const dbRuleAgendas = getDBRuleAgendas(db)

  return handlePromiseParser(
    z.promise(extendedAgendasSchema).parse(
      dbRuleAgendas
        .aggregate([
          {
            $set: {
              endedAt: {
                $add: [
                  '$createdAt',
                  {
                    $multiply: ['$duration', 1000 * 60 * 60],
                  },
                ],
              },
            },
          },
          {
            $match: {
              $or: [
                {
                  createdAt: {
                    $gte: currentRound.beginDate,
                    $lt: currentRound.endDate,
                  },
                },
                {
                  endedAt: {
                    $gte: currentRound.beginDate,
                    $lt: currentRound.endDate,
                  },
                },
              ],
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $set: {
              isEnded: {
                $cond: [{ $lte: ['$endedAt', currentRound.endDate] }, true, false],
              },
            },
          },
        ])
        .toArray(),
    ),
  )
}
