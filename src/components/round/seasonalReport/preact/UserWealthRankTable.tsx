import type { TypeUserWealthRank } from '../types'
import { currencyFormat } from '@/utils/helpers'
import UserLink from '@/components/common/preact/UserLink'

type Props = {
  round: string
  data: TypeUserWealthRank
}

export default function UserWealthRankTable({ round, data }: Props) {
  return (
    <table class="table-base table w-full table-fixed">
      <thead>
        <tr>
          <th class="w-20 text-center text-nowrap" title="排名">
            排名
          </th>
          <th class="text-center text-nowrap" title="使用者名稱">
            使用者名稱
          </th>
          <th class="max-w-32 text-center text-nowrap" title="持有現金">
            持有現金
          </th>
          <th class="max-w-32 text-center text-nowrap" title="持股總值">
            持股總值
          </th>
          <th class="max-w-64 text-center text-nowrap" title="總財富">
            總財富
            <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ userId, money, stocksValue, totalWealth }, index) => (
          <tr key={userId}>
            <td class="text-center text-nowrap">{index + 1}</td>
            <td class="truncate text-left">
              <UserLink round={round} userId={userId} />
            </td>
            <td class="text-right text-nowrap">$ {currencyFormat(money)}</td>
            <td class="text-right text-nowrap">$ {currencyFormat(stocksValue)}</td>
            <td class="text-right text-nowrap">$ {currencyFormat(totalWealth)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
