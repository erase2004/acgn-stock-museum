import type { TypeUserWealthRank } from '../types'
import { currencyFormat } from '@/utils/helpers'
import UserLink from '@/components/common/preact/UserLink'

type Props = {
  round: string
  data: TypeUserWealthRank
}

export default function UserWealthRankTable({ round, data }: Props) {
  return (
    <table className="table-base table">
      <thead>
        <tr>
          <th className="w-20 text-center text-nowrap" title="排名">
            排名
          </th>
          <th className="text-center text-nowrap" title="使用者名稱">
            使用者名稱
          </th>
          <th className="max-w-32 text-center text-nowrap" title="持有現金">
            持有現金
          </th>
          <th className="max-w-32 text-center text-nowrap" title="持股總值">
            持股總值
          </th>
          <th className="max-w-64 text-center text-nowrap" title="總財富">
            總財富
            <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ userId, money, stocksValue, totalWealth }, index) => (
          <tr key={userId} className="*:px-1">
            <td className="text-center text-nowrap">{index + 1}</td>
            <td className="truncate text-left">
              <UserLink round={round} userId={userId} />
            </td>
            <td className="text-right text-nowrap">$ {currencyFormat(money)}</td>
            <td className="text-right text-nowrap">$ {currencyFormat(stocksValue)}</td>
            <td className="text-right text-nowrap">$ {currencyFormat(totalWealth)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
