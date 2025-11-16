import type { TypeCompanyCapitalRank } from '../types'
import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  round: string
  data: TypeCompanyCapitalRank
}

export default function CompanyCapitalRankTable({ round, data }: Props) {
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
          <th class="max-w-32 text-center text-nowrap" title="總釋股數">
            總釋股數
          </th>
          <th class="max-w-32 text-center text-nowrap" title="總市值">
            總市值
          </th>
          <th class="max-w-64 text-center text-nowrap" title="資本額">
            資本額
            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(
          ({ companyId, companyName, isSeal, totalRelease, totalValue, capital }, index) => (
            <tr key={companyId} class="*:px-1">
              <td class="text-center text-nowrap">{index + 1}</td>
              <td class="truncate text-left">
                <SimpleCompanyLink
                  round={round}
                  companyId={companyId}
                  companyName={companyName}
                  isSeal={isSeal}
                />
              </td>
              <td class="text-right text-nowrap">{totalRelease}</td>
              <td class="text-right text-nowrap">$ {currencyFormat(totalValue)}</td>
              <td class="text-right text-nowrap">$ {currencyFormat(capital)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
