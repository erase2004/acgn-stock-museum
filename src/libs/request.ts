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
