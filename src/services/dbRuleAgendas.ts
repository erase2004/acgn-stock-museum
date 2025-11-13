// 議程資料集
import type { Db } from 'mongodb'
import type { Document } from 'mongodb'
import { z } from 'astro/zod'
import { schema as schemaRound } from './dbRound'
import { handlePromiseParser } from '@/utils/helpers'
import { datetime, integer, itemId, objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 議程標題 */
  title: z.string().min(1).max(100),
  /** 議程討論 URL */
  discussionUrl: z.string().url(),
  /** 議程建立時間 */
  createdAt: datetime,
  /** 議程長度(小時) */
  duration: integer.default(72),
  /** 議程描述 */
  description: z.string().min(10).max(3000),
  /** 提案人 User ID */
  proposer: itemId,
  /** 議程建立委員 User ID */
  creator: itemId,
  /** 議題列表 */
  issues: itemId.array(),
  /** 已投票使用者 User ID */
  votes: itemId.array(),
  /** 活躍玩家人數 */
  activeUserCount: integer.min(0).default(0),
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
    endedAt: datetime,
    /** 議程是否已結束 */
    isEnded: z.boolean(),
  })
  .array()

function getPipeline(currentRound: z.infer<typeof schemaRound>, filter: Document = {}): Document[] {
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
      $match: filter,
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
      .parse(dbRuleAgendas.aggregate(getPipeline(currentRound, { _id: agendaId })).toArray()),
  )

  if (Array.isArray(result)) return result[0]
  return result
}

export async function getAllBasicRuleAgendas(db: Db) {
  const _schema = schema.pick({ _id: true, title: true })
  const dbRuleAgendas = getDBRuleAgendas(db)

  return handlePromiseParser(z.promise(_schema.array()).parse(dbRuleAgendas.find({}).toArray()))
}
