// 系統公告資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser, typedObjectKeys } from '@/utils/helpers'

export const announcementCategoryMap = {
  maintenance: {
    displayName: '系統維護',
  },
  fsc: {
    displayName: '金管會',
  },
  plannedRuleChanges: {
    displayName: '規則更動計劃',
  },
  appliedRuleChanges: {
    displayName: '規則更動套用',
  },
  knownProblems: {
    displayName: '已知問題',
  },
  generalAnnouncements: {
    displayName: '營運公告',
  },
  miscellaneous: {
    displayName: '其他雜項',
  },
}

export const rejectionPetitionSchema = z.object({
  /** 活躍玩家人數 */
  activeUserCount: z.number().int().min(0),
  /** 連署門檻百分比 */
  thresholdPercent: z.number().min(0),
  /** 截止時間 */
  dueAt: z.coerce.date(),
  /** 通過時間 */
  passedAt: z.coerce.date().nullish(),
  /** 連署人列表 */
  signers: z.string().array(),
})

export const rejectionPollSchema = z.object({
  /** 活躍玩家人數 */
  activeUserCount: z.number().int().min(0),
  /** 投票門檻人數 */
  thresholdPercent: z.number().min(0),
  /** 截止時間 */
  dueAt: z.coerce.date(),
  /** 贊成列表 */
  yesVotes: z.string().array(),
  /** 反對列表 */
  noVotes: z.string().array(),
})

export const schema = z.object({
  _id: z.coerce.string(),
  /** 公告人 User ID */
  creator: z.string(),
  /** 類別 */
  category: z.enum(typedObjectKeys(announcementCategoryMap)),
  /** 主旨 */
  subject: z.string().min(1).max(100),
  /** 內容 */
  content: z.string().min(10).max(3000),
  /** 已讀玩家列表 */
  readers: z.string().array(),
  /** 建立日期 */
  createdAt: z.coerce.date(),
  /** 是否已作廢 */
  voided: z.boolean().default(false),
  /** 作廢原因 */
  voidedReason: z.string().min(1).max(100).nullish(),
  /** 作廢的使用者 */
  voidedBy: z.string().nullish(),
  /** 作廢時間 */
  voidedAt: z.coerce.date().nullish(),
  /** 否決連署 */
  rejectionPetition: rejectionPetitionSchema.nullish(),
  /** 否決投票 */
  rejectionPoll: rejectionPollSchema.nullish(),
})

export const listItemSchema = schema.pick({
  _id: true,
  creator: true,
  category: true,
  subject: true,
  createdAt: true,
  readers: true,
  voided: true,
})

export const casesWithCountSchema = z
  .object({
    total: z
      .object({
        total: z.number().int(),
      })
      .array()
      .max(1),
    data: listItemSchema.array(),
  })
  .array()

export function getDBAnnouncements(db: Db) {
  return db.collection('announcements')
}

export const querySchema = schema
  .pick({
    category: true,
  })
  .partial()

export function getAnnouncements(db: Db) {
  const dbAnnouncements = getDBAnnouncements(db)

  return handlePromiseParser(
    z.promise(casesWithCountSchema).parse(
      dbAnnouncements
        .aggregate([
          {
            $match: {
              voided: false,
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

export async function getAnnouncementById(db: Db, announcementId: string) {
  const dbAnnouncements = getDBAnnouncements(db)

  return handlePromiseParser(
    // @ts-expect-error: announcementId is valid ObjectId
    z.promise(schema).parse(dbAnnouncements.findOne({ _id: announcementId })),
  )
}
