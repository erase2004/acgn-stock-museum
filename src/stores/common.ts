import type { z } from 'astro/zod'
import type { schema as schemaUserArchive } from '@/services/dbUserArchive'
import { atom } from 'nanostores'

export const theme = atom('light')

export type UserArchive = Pick<
  z.infer<typeof schemaUserArchive>,
  'name' | 'status' | 'validateType'
>

export const userArchiveDict = atom<Record<string, UserArchive> | null>(null)
