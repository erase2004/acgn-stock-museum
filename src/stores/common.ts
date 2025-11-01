import type { z } from 'astro/zod'
import type { schema as schemaUserArchive } from '@/services/dbUserArchive'
import type { schema as schemaCompanyArchive } from '@/services/dbCompanyArchive'
import type { schema as schemaProduct } from '@/services/dbProducts'
import { atom } from 'nanostores'

export const theme = atom('light')

export type UserArchive = Pick<
  z.infer<typeof schemaUserArchive>,
  'name' | 'status' | 'validateType'
>

export const userArchiveDict = atom<Record<string, UserArchive> | null>(null)

export type CompanyArchive = Pick<z.infer<typeof schemaCompanyArchive>, 'companyName' | 'status'>

export const companyArchiveDict = atom<Record<string, CompanyArchive> | null>(null)

export type Product = Pick<z.infer<typeof schemaProduct>, 'productName' | 'type' | 'url'>

export const productDict = atom<Record<string, Product> | null>(null)
