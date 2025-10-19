// 議程資料集
import type { Db } from 'mongodb'
import type { Document } from 'mongodb'
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
  /** 議程描述 */
  description: z.string().min(10).max(3000),
  /** 提案人 User ID */
  proposer: z.string(),
  /** 議程建立委員 User ID */
  creator: z.string(),
  /** 議題列表 */
  issues: z.string().array(),
  /** 已投票使用者 User ID */
  votes: z.string().array(),
  /** 活躍玩家人數 */
  activeUserCount: z.number().int().min(0),
})

export function getDBRuleAgendas(db: Db) {
  return db.collection('ruleAgendas')
}

export const agendaListSchema = schema
  .pick({
    _id: true,
    title: true,
    discussionUrl: true,
    createdAt: true,
  })
  .extend({
    /** 議程結束時間  */
    endedAt: z.coerce.date(),
    /** 議程是否已結束 */
    isEnded: z.boolean(),
  })
  .array()

function getPipeline(
  currentRound: z.infer<typeof schemaRound>,
  filter: Document[] = [{}],
): Document[] {
  return [
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
        $and: [
          ...filter,
          {
            $or: [
              {
                createdAt: {
                  $lt: currentRound.endDate,
                },
              },
            ],
          },
        ],
      },
    },
    {
      $set: {
        isEnded: {
          $cond: [{ $lte: ['$endedAt', currentRound.endDate] }, true, false],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]
}

export async function getAllRuleAgendas(db: Db, currentRound: z.infer<typeof schemaRound>) {
  const dbRuleAgendas = getDBRuleAgendas(db)

  return handlePromiseParser(
    z.promise(agendaListSchema).parse(dbRuleAgendas.aggregate(getPipeline(currentRound)).toArray()),
  )
}

export async function getAgendaById(
  db: Db,
  currentRound: z.infer<typeof schemaRound>,
  agendaId: string,
) {
  const dbRuleAgendas = getDBRuleAgendas(db)

  const result = await handlePromiseParser(
    z
      .promise(schema.array())
      .parse(dbRuleAgendas.aggregate(getPipeline(currentRound, [{ _id: agendaId }])).toArray()),
  )

  if (Array.isArray(result)) return result[0]
  return result
}
