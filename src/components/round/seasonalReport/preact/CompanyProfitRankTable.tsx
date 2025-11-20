import type { TypeCompanyProfitRank } from '../types'
import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  round: string
  data: TypeCompanyProfitRank
}

export default function CompanyProfitRankTable({ round, data }: Props) {
  return (
    <table className="table-base table">
      <thead>
        <tr className="*:px-1">
          <th className="w-10 text-center text-nowrap" title="排名">
            排名
          </th>
          <th className="text-center text-nowrap" title="公司名稱">
            公司名稱
          </th>
          <th className="max-w-32 text-center text-nowrap" title="季營利額">
            季營利額
          </th>
          <th className="max-w-32 text-center text-nowrap" title="總釋股數">
            總釋股數
          </th>
          <th className="max-w-32 text-center text-nowrap" title="平均股價">
            平均股價
          </th>
          <th className="max-w-32 text-center text-nowrap" title="益本比">
            益本比
            <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(
          (
            { companyId, companyName, isSeal, profit, totalRelease, avgPrice, priceToEarn },
            index,
          ) => (
            <tr key={companyId} className="*:px-1">
              <td className="text-center text-nowrap">{index + 1}</td>
              <td className="truncate text-left">
                <SimpleCompanyLink
                  round={round}
                  companyId={companyId}
                  companyName={companyName}
                  isSeal={isSeal}
                />
              </td>
              <td className="text-right text-nowrap">$ {currencyFormat(profit)}</td>
              <td className="text-right text-nowrap">{totalRelease}</td>
              <td className="text-right text-nowrap">$ {currencyFormat(avgPrice)}</td>
              <td className="text-right text-nowrap">{priceToEarn}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
