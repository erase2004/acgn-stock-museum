import { companyProfitDistribution } from '@/configs/general'
import type { ListItem } from '@/stores/company'

type CompanyData = Pick<
  ListItem,
  | 'listPrice'
  | 'manager'
  | 'profit'
  | 'totalRelease'
  | 'managerBonusRatePercent'
  | 'employeeBonusRatePercent'
  | 'capitalIncreaseRatePercent'
  | 'employeeCount'
>

export function getCompanyEPS(companyData: CompanyData) {
  const {
    manager,
    profit,
    totalRelease,
    managerBonusRatePercent,
    employeeBonusRatePercent,
    capitalIncreaseRatePercent,
    employeeCount,
  } = companyData

  const { incomeTaxRatePercent, employeeProductVotingRewardRatePercent } = companyProfitDistribution

  const hasManager = manager !== '!none'
  const hasEmployees = employeeCount > 0

  const directorBonusRatePercent =
    100 -
    [
      incomeTaxRatePercent,
      capitalIncreaseRatePercent,
      hasManager ? managerBonusRatePercent : 0,
      hasEmployees ? employeeBonusRatePercent : 0,
      hasEmployees ? employeeProductVotingRewardRatePercent : 0,
    ].reduce((a, b) => {
      return a + b
    }, 0)

  return ((profit * directorBonusRatePercent) / 100 / totalRelease).toFixed(2)
}

export function getCompanyPERatio(companyData: CompanyData) {
  const eps = parseFloat(getCompanyEPS(companyData))

  return eps === 0 ? '∞' : (companyData.listPrice / eps).toFixed(2)
}

export function getCompanyEPRatio(companyData: CompanyData) {
  return (parseFloat(getCompanyEPS(companyData)) / companyData.listPrice).toFixed(2)
}

export function priceDisplayClass(item: Pick<ListItem, 'lastPrice' | 'listPrice'>) {
  const { lastPrice, listPrice } = item

  if (lastPrice > listPrice) return 'text-error'

  if (listPrice > lastPrice) return 'text-success'

  return ''
}
