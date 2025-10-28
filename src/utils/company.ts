import { companyProfitDistribution } from '@/configs/general'
import type { ListItem } from '@/stores/company'

export function getCompanyEPS(
  companyData: Pick<
    ListItem,
    | 'manager'
    | 'profit'
    | 'totalRelease'
    | 'managerBonusRatePercent'
    | 'employeeBonusRatePercent'
    | 'capitalIncreaseRatePercent'
    | 'employeeCount'
  >,
) {
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
