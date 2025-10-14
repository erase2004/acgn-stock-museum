import type { Db } from 'mongodb'
import { z } from 'astro/zod'

export const SpecialUser = {
  NONE: '!none',
  SYSTEM: '!system',
  FSC: '!FSC',
}

export const UserRole = {
  SUPER_ADMIN: {
    name: 'superAdmin',
    displayName: '超級管理員',
  },
  GENERAL_MANAGER: {
    name: 'generalManager',
    displayName: '營運總管',
  },
  DEVELOPER: {
    name: 'developer',
    displayName: '工程部成員',
    manageableBy: ['GENERAL_MANAGER'],
  },
  PLANNER: {
    name: 'planner',
    displayName: '企劃部成員',
    manageableBy: ['GENERAL_MANAGER'],
  },
  FSC_MEMBER: {
    name: 'fscMember',
    displayName: '金管會成員',
    manageableBy: ['GENERAL_MANAGER'],
  },
}

export function roleDisplayName(role: string) {
  return (
    Object.values(UserRole).find((user) => user.name === role) ?? {
      displayName: `未知的身份組成員(${role})`,
    }
  ).displayName
}

const profileSchema = z.object({
  /** 使用者名稱 */
  name: z.string(),
  /** 使用者的系統權限組 */
  roles: z
    .string()
    .array()
    .refine((val) => {
      if (val.length > 0) {
        const validRoles = Object.values(UserRole).map((role) => role.name)

        return val.every((v) => validRoles.includes(v))
      }
      return true
    }),
})

export const schema = z.object({
  _id: z.string(),
  /** 使用者 PTT 帳號名稱 */
  username: z.string().optional(),
  /** 驗證成功日期 */
  createdAt: z.coerce.date(),
  profile: profileSchema,
})

export function getDBUsers(db: Db) {
  return db.collection('users')
}
