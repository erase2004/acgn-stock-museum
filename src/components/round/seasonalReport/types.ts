import z from 'astro/zod'
import type { schema as schemaRankCompanyPrice } from '@/services/dbRankCompanyPrice'
import type { schema as schemaRankCompanyProfit } from '@/services/dbRankCompanyProfit'
import type { schema as schemaRankCompanyValue } from '@/services/dbRankCompanyValue'
import type { schema as schemaRankCompanyCapital } from '@/services/dbRankCompanyCapital'
import type { schema as schemaRankUserWealth } from '@/services/dbRankUserWealth'

export type TypeCompanyPriceRank = Array<
  z.infer<typeof schemaRankCompanyPrice> & {
    totalMoney: number
    companyName: string
    isSeal: boolean
  }
>

export type TypeCompanyProfitRank = Array<
  z.infer<typeof schemaRankCompanyProfit> & { companyName: string; isSeal: boolean }
>

export type TypeCompanyValueRank = Array<
  z.infer<typeof schemaRankCompanyValue> & {
    totalValue: number
    companyName: string
    isSeal: boolean
  }
>

export type TypeCompanyCapitalRank = Array<
  z.infer<typeof schemaRankCompanyCapital> & { companyName: string; isSeal: boolean }
>

export type TypeUserWealthRank = Array<
  z.infer<typeof schemaRankUserWealth> & { totalWealth: number; name: string }
>
