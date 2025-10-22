import DisplayLog from '@/components/common/preact/DisplayLog'
import { z } from 'astro/zod'
import { logsWithCountSchema } from '@/services/dbLog'
import { useMemo } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { currentPage, hasMore } from '@/stores/pagination'

type Props = {
  round: string
  pageSize: number
  total: number
  data: z.infer<typeof logsWithCountSchema>[number]['data']
}

export default function RelatedLogListContainer({ round, pageSize, total, data }: Props) {
  const $currentPage = useStore(currentPage)

  const displayItems = useMemo(() => {
    const newList = data.slice(0, pageSize * $currentPage)
    hasMore.set(newList.length < total)
    return newList
  }, [$currentPage])

  if (!total) return <em class="mx-4">沒有任何紀錄！</em>

  return (
    <ul class="relative pl-0">
      {displayItems.map((item) => (
        <li key={item._id} class="list-none">
          <DisplayLog round={round} {...item} />
        </li>
      ))}
    </ul>
  )
}
