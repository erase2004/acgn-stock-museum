import DisplayLog from '@/components/common/preact/DisplayLog'
import { z } from 'astro/zod'
import { logsWithCountSchema } from '@/services/dbLog'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.violationRelatedLog

type Props = {
  storeKey: string
  round: string
  total: number
  data: z.infer<typeof logsWithCountSchema>[number]['data']
}

export default function RelatedLogListContainer({ storeKey, round, total, data }: Props) {
  const displayItems = useDisplayItems(data, storeKey, PAGE_SIZE)

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
