import type { TypeCompanyValueRank } from '../types'
import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  round: string
  data: TypeCompanyValueRank
}

export default function CompanyValueRankTable({ round, data }: Props) {
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
          <th className="max-w-32 text-center text-nowrap" title="收盤股價">
            收盤股價
          </th>
          <th className="max-w-32 text-center text-nowrap" title="總釋股數">
            總釋股數
          </th>
          <th className="max-w-64 text-center text-nowrap" title="總市值">
            總市值
            <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(
          ({ companyId, companyName, isSeal, lastPrice, totalRelease, totalValue }, index) => (
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
              <td className="text-right text-nowrap">$ {currencyFormat(lastPrice)}</td>
              <td className="text-right text-nowrap">{totalRelease}</td>
              <td className="text-right text-nowrap">$ {currencyFormat(totalValue)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
