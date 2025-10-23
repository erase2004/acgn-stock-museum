import type { TypeCompanyProfitRank } from '../types'
import CompanyLink from '@/components/common/preact/CompanyLink'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  round: string
  data: TypeCompanyProfitRank
}

export default function CompanyProfitRankTable({ round, data }: Props) {
  return (
    <table class="table-base table">
      <thead>
        <tr>
          <th class="w-20 text-center text-nowrap" title="排名">
            排名
          </th>
          <th class="text-center text-nowrap" title="公司名稱">
            公司名稱
          </th>
          <th class="max-w-32 text-center text-nowrap" title="季營利額">
            季營利額
          </th>
          <th class="max-w-32 text-center text-nowrap" title="總釋股數">
            總釋股數
          </th>
          <th class="max-w-32 text-center text-nowrap" title="平均股價">
            平均股價
          </th>
          <th class="max-w-32 text-center text-nowrap" title="益本比">
            益本比
            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ companyId, profit, totalRelease, avgPrice, priceToEarn }, index) => (
          <tr key={companyId} class="*:px-1">
            <td class="text-center text-nowrap">{index + 1}</td>
            <td class="truncate text-left">
              <CompanyLink round={round} companyId={companyId} />
            </td>
            <td class="text-right text-nowrap">$ {currencyFormat(profit)}</td>
            <td class="text-right text-nowrap">{totalRelease}</td>
            <td class="text-right text-nowrap">$ {currencyFormat(avgPrice)}</td>
            <td class="text-right text-nowrap">{priceToEarn}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
