import { z } from 'astro/zod'
import { stocksWithCountSchema } from '@/services/dbDirectors'
import { useEffect, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { currentPage, isDataLoading } from '@/stores/pagination'
import { getAccountOwnStocks } from '@/libs/request'
import CompanyLink from '@/components/common/preact/CompanyLink'

type Props = {
  round: string
  pageSize: number
  userId: string
  total: number
  data: z.infer<typeof stocksWithCountSchema>[number]['data']
}

export default function ListContainer({ round, pageSize, userId, total, data }: Props) {
  const [items, setItems] = useState(data)
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)

  useEffect(() => {
    if ($isDataLoading) return
    if ($currentPage === 1) return

    isDataLoading.set(true)
    getAccountOwnStocks(round, userId, pageSize, $currentPage)
      .then(async (response) => {
        const data = await z.promise(stocksWithCountSchema).parse(response.json())

        if (data) {
          const newItems = items.concat(...(data[0]?.data ?? []))
          setItems(newItems)
        }
      })
      .finally(() => {
        isDataLoading.set(false)
      })
  }, [$currentPage])

  let tbodyContent

  if (!total) {
    tbodyContent = (
      <tr>
        <td class="text-center" colspan={2}>
          查無資料！
        </td>
      </tr>
    )
  } else {
    tbodyContent = items.map((item) => (
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
