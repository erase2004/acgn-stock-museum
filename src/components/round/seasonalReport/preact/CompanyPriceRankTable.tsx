import type { TypeCompanyPriceRank } from '../types'
import CompanyLink from '@/components/common/preact/CompanyLink'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  round: string
  data: TypeCompanyPriceRank
}

export default function CompanyPriceRankTable({ round, data }: Props) {
  return (
    <table class="table-base table w-full table-fixed">
      <thead>
        <tr>
          <th class="w-20 text-center text-nowrap" title="排名">
            排名
          </th>
          <th class="text-center text-nowrap" title="公司名稱">
            公司名稱
          </th>
          <th class="max-w-32 text-center text-nowrap" title="季成交量">
            季成交量
          </th>
          <th class="max-w-32 text-center text-nowrap" title="季成交額">
            季成交額
          </th>
          <th class="max-w-32 text-center text-nowrap" title="產品營利">
            產品營利
          </th>
          <th class="max-w-32 text-center text-nowrap" title="季金流額">
            季金流額
            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(
          ({ companyId, totalDealAmount, totalDealMoney, totalMoney, productProfit }, index) => (
            <tr key={companyId}>
              <td class="text-center text-nowrap">{index + 1}</td>
              <td class="truncate text-left">
                <CompanyLink round={round} companyId={companyId} />
              </td>
              <td class="text-right text-nowrap">{currencyFormat(totalDealAmount)}</td>
              <td class="text-right text-nowrap">$ {currencyFormat(totalDealMoney)}</td>
              <td class="text-right text-nowrap">$ {currencyFormat(productProfit)}</td>
              <td class="text-right text-nowrap">$ {currencyFormat(totalMoney)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
