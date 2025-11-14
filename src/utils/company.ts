import {
  companyProfitDistribution,
  companyProfitDistributionForFirstRound,
} from '@/configs/general'
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

/** 適用於第一季的計算方式 */
export function getCompanyEPSForFirstRound(companyData: CompanyData) {
  const { incomeTaxRatePercent, managerBonusRatePercent } = companyProfitDistributionForFirstRound

  const { manager, profit, totalRelease, employeeCount, employeeBonusRatePercent } = companyData

  let multiplier = 100

  const hasManager = manager !== '!none'
  const hasEmployees = employeeCount > 0

  multiplier -= [
    hasManager ? managerBonusRatePercent : 0,
    hasEmployees ? employeeBonusRatePercent : 0,
    incomeTaxRatePercent,
  ].reduce((a, b) => a + b, 0)

  return ((profit * multiplier) / 100 / totalRelease).toFixed(2)
}

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

export function getCompanyPERatio(isFirstRound: boolean, companyData: CompanyData) {
  const eps = parseFloat(
    isFirstRound ? getCompanyEPSForFirstRound(companyData) : getCompanyEPS(companyData),
  )

  return eps === 0 ? '∞' : (companyData.listPrice / eps).toFixed(2)
}

export function getCompanyEPRatio(isFirstRound: boolean, companyData: CompanyData) {
  return (
    parseFloat(
      isFirstRound ? getCompanyEPSForFirstRound(companyData) : getCompanyEPS(companyData),
    ) / companyData.listPrice
  ).toFixed(2)
}

export function priceDisplayClass(item: Pick<ListItem, 'lastPrice' | 'listPrice'>) {
  const { lastPrice, listPrice } = item

  if (lastPrice > listPrice) return 'text-error'

  if (listPrice > lastPrice) return 'text-success'

  return ''
}

export function getStockPercentage(stocks: number, totalRelease: number) {
  return Math.round((stocks / totalRelease) * 10000) / 100
}
