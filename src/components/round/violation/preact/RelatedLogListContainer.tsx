import DisplayLog from '@/components/common/preact/DisplayLog'
import { z } from 'astro/zod'
import { schema } from '@/services/dbLog'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.violationRelatedLog

type Props = {
  storeKey: string
  round: string
  data: z.infer<typeof schema>[]
}

export default function RelatedLogListContainer({ storeKey, round, data }: Props) {
  const displayItems = useDisplayItems(data, storeKey, PAGE_SIZE)

  if (!data.length) return <em class="mx-4">沒有任何紀錄！</em>

  return (
    <ul class="relative pl-0">
      {displayItems.map((item) => (
        <li key={item._id} class="list-none break-all">
          <DisplayLog round={round} {...item} />
        </li>
      ))}
    </ul>
  )
}
