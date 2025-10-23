// 最萌亂鬥大賽紀錄資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'

export const schema = z.object({
  _id: z.coerce.string(),
  /** 紀錄的順序 */
  sequence: z.number().int(),
  /** 紀錄的回合數 */
  round: z.number().int(),
  /** 紀錄相關的公司ID陣列, 0 為攻擊者, 1 為防禦者 */
  companyId: z.string().array(),
  /**
   * 紀錄攻擊者使用的招式 index，
   * 正數 -1 對應 dbArenaFighters 資料集的 normalManner 陣列 index，
   * 負數 +1 對應 specialManner 的陣列 index
   */
  attackManner: z.number().int(),
  /** 紀錄當次攻擊動作造成的傷害，0 為未命中 */
  damage: z.number().int(),
  /** 紀錄攻擊者發動攻擊時的 SP */
  attackerSp: z.number().int(),
  /** 紀錄防禦者被攻擊後的 HP */
  defenderHp: z.number().int(),
  /** 紀錄若防禦者被擊倒，攻擊者得到的收益 */
  profit: z.number().optional(),
})

function getCollectionName(arenaId: string) {
  return `arenaLog${arenaId}`
}

export function getDBArenaLog(db: Db, arenaId: string) {
  return db.collection(getCollectionName(arenaId))
}

export function getArenaLogs(db: Db, arenaId: string) {
  const dbArenaLog = getDBArenaLog(db, arenaId)

  return handlePromiseParser(
    z.promise(schema.array()).parse(dbArenaLog.find({}, { sort: { sequence: 1 } }).toArray()),
  )
}
