export function getUserStock(round: string, userId: string) {
  return fetch(`/api/user-stock?${new URLSearchParams({ round, userId }).toString()}`)
}

export function getUserCompanyProductTotal(round: string, userId: string) {
  return fetch(`/api/user-product?${new URLSearchParams({ round, userId }).toString()}`)
}
