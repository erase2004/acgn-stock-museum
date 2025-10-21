import { z } from 'astro/zod'
import { logsWithCountSchema } from '@/services/dbLog'
import { useEffect, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { currentPage, isDataLoading } from '@/stores/pagination'
import { getFSCLogs } from '@/libs/request'
import DisplayLog from '@/components/common/preact/DisplayLog'

type Props = {
  round: string
  pageSize: number
  total: number
  data: z.infer<typeof logsWithCountSchema>[number]['data']
}

export default function ListContainer({ round, pageSize, total, data }: Props) {
  const [items, setItems] = useState(data)
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)

  useEffect(() => {
    if ($isDataLoading) return
    if ($currentPage === 1) return

    isDataLoading.set(true)
    getFSCLogs(round, pageSize, $currentPage)
      .then(async (response) => {
        const data = await z.promise(logsWithCountSchema).parse(response.json())

        if (data) {
          const newItems = items.concat(...(data[0]?.data ?? []))
          setItems(newItems)
        }
      })
      .finally(() => {
        isDataLoading.set(false)
      })
  }, [$currentPage])

  if (!total) return <em>沒有資料</em>

  return (
    <ul class="relative pl-0">
      {items.map((d) => (
        <li key={d._id} class="list-none">
          <DisplayLog round={round} {...d} />
        </li>
      ))}
    </ul>
  )
}
