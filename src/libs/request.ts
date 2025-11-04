export function getUserCompanyProductTotal(round: string, userId: string) {
  return fetch(`/api/user-product?${new URLSearchParams({ round, userId }).toString()}`)
}
