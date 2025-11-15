import { z } from 'astro/zod'
import { stocksWithCountSchema } from '@/services/dbDirectors'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage } from '@/configs/general'
import { useStore } from '@nanostores/preact'
import { totalAmount } from '@/stores/pagination'
import { getCompanyUrl } from '@/libs/routes'

const PAGE_SIZE = dataNumberPerPage.fscStock

type Stock = z.infer<typeof stocksWithCountSchema>[number]['data'][number]
type Props = {
  storeKey: string
  round: string
  data: Stock[]
}

export default function ListContainer({ storeKey, round, data }: Props) {
  const $totalAmount = useStore(totalAmount)
  const displayItems = useDisplayItems(data, storeKey, PAGE_SIZE)

  let tbodyContent

  if (!data.length) {
    tbodyContent = (
      <tr>
        <td class="text-center" colspan={2}>
          查無資料！
        </td>
      </tr>
    )
  } else {
    tbodyContent = displayItems.map((item) => (
      <tr key={item.companyId}>
        <td>
          <a href={getCompanyUrl(round, item.companyId)} class={item.isSeal ? 'text-error' : ''}>
            {item.companyName}
          </a>
        </td>
        <td class="text-right">{item.stocks} 股</td>
      </tr>
    ))
  }

  return (
    <div class="mx-auto max-w-3xl">
      <p>總共{$totalAmount[storeKey]}筆</p>
      <table class="table-pin-rows table-base table">
        <thead>
          <tr>
            <th class="text-center" title="公司名稱">
              公司名稱
            </th>
            <th class="w-1/3 text-center" title="持有股數">
              持有股數
            </th>
          </tr>
        </thead>
        <tbody>{tbodyContent}</tbody>
      </table>
    </div>
  )
}
