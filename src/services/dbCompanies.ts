// 公司資料集
import type { Db } from 'mongodb'
import type { ZodTypeAny } from 'astro/zod'
import { z } from 'astro/zod'
import { datetime, integer, itemId, objectId } from './schema'
import { handlePromiseParser } from '@/utils/helpers'
import { companyProfitDistribution } from '@/configs/general'
import { last } from 'lodash-es'

// 公司評等名稱
const gradeNameList = ['S', 'A', 'B', 'C', 'D'] as const

type Grade = (typeof gradeNameList)[number]

// 公司評等係數
export const gradeFactorTable = {
  // 挖礦機獲利係數
  miningMachine: {
    S: 0.4,
    A: 0.3,
    B: 0.2,
    C: 0.1,
    D: 0,
  },
} satisfies Record<string, Record<Grade, number>>

export const schema = z.object({
  _id: objectId,
  /** 董事長的稱謂 */
  chairmanTitle: z.string().max(20).default('董事長'),
  /** 是否被金管會查封關停 */
  isSeal: z.boolean().default(false),
  /** 公司名稱 */
  companyName: z.string().min(1).max(100),
  /** 創立者 User ID */
  founder: itemId,
  /** 經理人 User ID */
  manager: itemId,
  /** 董事長 User ID */
  chairman: itemId,
  /** 小圖 */
  pictureSmall: z.string().url().optional(),
  /** 大圖 */
  pictureBig: z.string().url().optional(),
  /** 介紹描述 */
  description: z.string().min(10).max(3000),
  /** 違規描述 */
  illegalReason: z.string().max(10).optional(),
  /** 目前總釋出股份 */
  totalRelease: integer.min(0),
  /** 最後成交價格 */
  lastPrice: integer.min(0),
  /** 參考每股單價 */
  listPrice: integer.min(0),
  /** 當季已營利 */
  profit: z.number().min(0).default(0),
  /** 資本額 */
  capital: integer.min(0),
  /** 公司評等 */
  grade: z.enum(gradeNameList).default(last(gradeNameList)!),
  /** 參考總市值 */
  totalValue: integer.min(0),
  /** 公司上市日期 */
  createdAt: datetime,
  /** 員工分紅佔比 */
  employeeBonusRatePercent: z
    .number()
    .default(companyProfitDistribution.employeeBonusRatePercent.default),
  /** 經理分紅佔比 */
  managerBonusRatePercent: z
    .number()
    .default(companyProfitDistribution.managerBonusRatePercent.default),
  /** 營利投入資本額佔比 */
  capitalIncreaseRatePercent: z
    .number()
    .default(companyProfitDistribution.capitalIncreaseRatePercent.default),
  tags: z.string().array().max(50),
  /** 選舉經理時的候選者 User ID 列表 */
  candidateList: itemId.array(),
  /** 選舉經理時的各候選者的支持董事 User ID 列表 */
  voteList: itemId.array().array(),
})

export const simpleSchema = schema.pick({
  _id: true,
  chairmanTitle: true,
  isSeal: true,
})

export const listItemSchema = schema.pick({
  _id: true,
  companyName: true,
  founder: true,
  manager: true,
  chairmanTitle: true,
  chairman: true,
  pictureSmall: true,
  illegalReason: true,
  totalRelease: true,
  lastPrice: true,
  listPrice: true,
  profit: true,
  capital: true,
  totalValue: true,
  createdAt: true,
  employeeBonusRatePercent: true,
  managerBonusRatePercent: true,
  capitalIncreaseRatePercent: true,
  tags: true,
})

export function getDBCompanies(db: Db) {
  return db.collection('companies')
}

export function getCompanies(db: Db) {
  const dbCompanies = getDBCompanies(db)

  return handlePromiseParser(
    z
      .promise(listItemSchema.array())
      .parse(dbCompanies.find({ isSeal: false }, { sort: { lastPrice: -1 } }).toArray()),
  )
}

export function getCompanyFilterByCustomSchema<T extends ZodTypeAny>(
  db: Db,
  companyId: string,
  schema: T,
) {
  const dbCompanies = getDBCompanies(db)

  return handlePromiseParser(
    z.promise(schema).parse(
      dbCompanies.findOne({
        // @ts-expect-error: companyId is valid ObjectId
        _id: companyId,
      }),
    ),
  )
}
