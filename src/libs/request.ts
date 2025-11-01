export function getCompany(round: string, companyId: string) {
  return fetch(`/api/company?${new URLSearchParams({ round, companyId }).toString()}`)
}

export function getProduct(round: string, productId: string) {
  return fetch(`/api/product?${new URLSearchParams({ round, productId }).toString()}`)
}

export function getUserStock(round: string, userId: string) {
  return fetch(`/api/user-stock?${new URLSearchParams({ round, userId }).toString()}`)
}

export function getUserCompanyProductTotal(round: string, userId: string) {
  return fetch(`/api/user-product?${new URLSearchParams({ round, userId }).toString()}`)
}
