import type { TypeCompanyPriceRank } from '../types'
import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  round: string
  data: TypeCompanyPriceRank
}

export default function CompanyPriceRankTable({ round, data }: Props) {
  return (
    <table className="table-base table">
      <thead>
        <tr>
          <th className="w-20 text-center text-nowrap" title="排名">
            排名
          </th>
          <th className="text-center text-nowrap" title="公司名稱">
            公司名稱
          </th>
          <th className="max-w-32 text-center text-nowrap" title="季成交量">
            季成交量
          </th>
          <th className="max-w-32 text-center text-nowrap" title="季成交額">
            季成交額
          </th>
          <th className="max-w-32 text-center text-nowrap" title="產品營利">
            產品營利
          </th>
          <th className="max-w-32 text-center text-nowrap" title="季金流額">
            季金流額
            <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(
          (
            {
              companyId,
              companyName,
              isSeal,
              totalDealAmount,
              totalDealMoney,
              totalMoney,
              productProfit,
            },
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
              <td className="text-right text-nowrap">{currencyFormat(totalDealAmount)}</td>
              <td className="text-right text-nowrap">$ {currencyFormat(totalDealMoney)}</td>
              <td className="text-right text-nowrap">$ {currencyFormat(productProfit)}</td>
              <td className="text-right text-nowrap">$ {currencyFormat(totalMoney)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
