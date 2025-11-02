import DisplayLog from '@/components/common/preact/DisplayLog'
import { z } from 'astro/zod'
import { schema } from '@/services/dbLog'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage } from '@/configs/general'

const PAGE_SIZE = dataNumberPerPage.fscLogs

type Log = z.infer<typeof schema>

type Props = {
  storeKey: string
  round: string
  data: Log[]
}

export default function ListContainer({ storeKey, round, data }: Props) {
  const displayItems = useDisplayItems(data, storeKey, PAGE_SIZE)

  if (!data.length) return <em>沒有資料</em>

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
