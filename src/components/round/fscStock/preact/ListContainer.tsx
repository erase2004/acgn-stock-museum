import CompanyLink from '@/components/common/preact/CompanyLink'
import { z } from 'astro/zod'
import { schema } from '@/services/dbDirectors'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.fscStock

type Stock = Pick<z.infer<typeof schema>, 'companyId' | 'stocks'>
type Props = {
  storeKey: string
  round: string
  data: Stock[]
}

export default function ListContainer({ storeKey, round, data }: Props) {
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
          <CompanyLink round={round} companyId={item.companyId} />
        </td>
        <td class="text-right">{item.stocks} 股</td>
      </tr>
    ))
  }

  return (
    <div class="mx-auto max-w-3xl border border-base-300">
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
