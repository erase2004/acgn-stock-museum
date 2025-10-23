import DisplayLog from '@/components/common/preact/DisplayLog'
import { z } from 'astro/zod'
import { logsWithCountSchema } from '@/services/dbLog'
import { useMemo } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { currentPage, hasMore } from '@/stores/pagination'

type Props = {
  storeKey: string
  round: string
  pageSize: number
  total: number
  data: z.infer<typeof logsWithCountSchema>[number]['data']
}

export default function ListContainer({ storeKey, round, pageSize, total, data }: Props) {
  const $currentPage = useStore(currentPage)

  const displayItems = useMemo(() => {
    const newList = data.slice(0, pageSize * $currentPage[storeKey])
    hasMore.setKey(storeKey, newList.length < total)
    return newList
  }, [$currentPage[storeKey]])

  if (!total) return <em>沒有資料</em>

  return (
    <ul class="relative pl-0">
      {displayItems.map((items) => (
        <li key={items._id} class="list-none">
          <DisplayLog round={round} {...items} />
        </li>
      ))}
    </ul>
  )
}
