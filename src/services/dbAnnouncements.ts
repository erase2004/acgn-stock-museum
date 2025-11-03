// 系統公告資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser, typedObjectKeys } from '@/utils/helpers'
import { datetime, integer, itemId, objectId } from './schema'

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
  activeUserCount: integer.min(0),
  /** 連署門檻百分比 */
  thresholdPercent: z.number().min(0),
  /** 截止時間 */
  dueAt: datetime,
  /** 通過時間 */
  passedAt: datetime.nullish(),
  /** 連署人列表 */
  signers: itemId.array(),
})

export const rejectionPollSchema = z.object({
  /** 活躍玩家人數 */
  activeUserCount: integer.min(0),
  /** 投票門檻人數 */
  thresholdPercent: z.number().min(0),
  /** 截止時間 */
  dueAt: datetime,
  /** 贊成列表 */
  yesVotes: itemId.array(),
  /** 反對列表 */
  noVotes: itemId.array(),
})

export const schema = z.object({
  _id: objectId,
  /** 公告人 User ID */
  creator: itemId,
  /** 類別 */
  category: z.enum(typedObjectKeys(announcementCategoryMap)),
  /** 主旨 */
  subject: z.string().min(1).max(100),
  /** 內容 */
  content: z.string().min(10).max(3000),
  /** 已讀玩家列表 */
  readers: itemId.array(),
  /** 建立日期 */
  createdAt: datetime,
  /** 是否已作廢 */
  voided: z.boolean().default(false),
  /** 作廢原因 */
  voidedReason: z.string().min(1).max(100).nullish(),
  /** 作廢的使用者 */
  voidedBy: itemId.nullish(),
  /** 作廢時間 */
  voidedAt: datetime.nullish(),
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

export function getDBAnnouncements(db: Db) {
  return db.collection('announcements')
}

export function getAnnouncements(db: Db) {
  const dbAnnouncements = getDBAnnouncements(db)

  return handlePromiseParser(
    z.promise(listItemSchema.array()).parse(
      dbAnnouncements
        .find(
          {
            voided: false,
          },
          {
            sort: {
              createdAt: -1,
            },
          },
        )
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
