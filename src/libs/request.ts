import type { z } from 'astro/zod'
import type { querySchema } from '@/services/dbViolationCases'

export function getUser(round: string, userId: string) {
  return fetch(`/api/user?${new URLSearchParams({ round, userId }).toString()}`)
}

export function getCompany(round: string, companyId: string) {
  return fetch(`/api/company?${new URLSearchParams({ round, companyId }).toString()}`)
}

export function getProduct(round: string, productId: string) {
  return fetch(`/api/product?${new URLSearchParams({ round, productId }).toString()}`)
}

export function getFSCLogs(round: string, size: number, page: number) {
  return fetch(
    `/api/fsc-logs?${new URLSearchParams({ round, size: String(size), page: String(page) }).toString()}`,
  )
}

export function getAccountOwnStocks(round: string, userId: string, size: number, page: number) {
  return fetch(
    `/api/account-own-stocks?${new URLSearchParams({ round, userId, size: String(size), page: String(page) }).toString()}`,
  )
}

export function getViolationCases(
  round: string,
  filter: z.infer<typeof querySchema>,
  size: number,
  page: number,
) {
  return fetch(
    `/api/violation?${new URLSearchParams(Object.assign({ round, size: String(size), page: String(page) }, filter)).toString()}`,
  )
}
