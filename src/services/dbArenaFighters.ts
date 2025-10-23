// 最萌亂鬥大賽報名公司資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'

const MAX_MANNER_SIZE = 3

export const arenaFighterSortableFields = [
  'hp',
  'sp',
  'atk',
  'def',
  'agi',
  'rank',
  'totalInvestedAmount',
] as const

const attributeParameters = {
  hp: { cost: 200, base: 100 },
  sp: { cost: 1000, base: 10 },
  atk: { cost: 1000, base: 20 },
  def: { cost: 1000, base: 5 },
  agi: { cost: 1000, base: 0 },
}

export function getAttributeNumber(attribute: keyof typeof attributeParameters, amount: number) {
  const { cost, base } = attributeParameters[attribute]

  return base + Math.floor(amount / cost)
}

const investmentSchema = z.number().int().default(0)
const mannerSchema = z.array(z.string().min(1).max(150)).max(MAX_MANNER_SIZE)

export const schema = z.object({
  _id: z.coerce.string(),
  /** 對應的大賽 ID */
  arenaId: z.string(),
  /** 公司 ID */
  companyId: z.string(),
  /** 報名截止時，該報名角色的經理 User ID (決定該次大賽戰鬥時決策的經理 User ID) */
  manager: z.string().optional(),
  /** 亂鬥名次（於亂鬥結束時產生） */
  rank: z.number().int().optional(),
  /** 總投資額 */
  totalInvestedAmount: investmentSchema,
  /** 目前已投資在 hp 屬性上的總資金量 */
  hp: investmentSchema,
  /** 目前已投資在 sp 屬性上的總資金量 */
  sp: investmentSchema,
  /** 目前已投資在 atk 屬性上的總資金量 */
  atk: investmentSchema,
  /** 目前已投資在 def 屬性上的總資金量 */
  def: investmentSchema,
  /** 目前已投資在 agi 屬性上的總資金量 */
  agi: investmentSchema,
  /** 公司上市日期，在 agi 相等時排列攻擊順序使用 */
  createdAt: z.coerce.date(),
  /** 特攻消耗數值 */
  spCost: z.number().int().min(1).default(5),
  /** 一般攻擊招式表 */
  normalManner: mannerSchema,
  /** 特殊攻擊招式表 */
  specialManner: mannerSchema,
})

export function getDBArenaFighters(db: Db) {
  return db.collection('arenaFighters')
}

export function getFighters(db: Db, arenaId: string) {
  const dbArenaFighters = getDBArenaFighters(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbArenaFighters
        .find({
          arenaId,
        })
        .toArray(),
    ),
  )
}
