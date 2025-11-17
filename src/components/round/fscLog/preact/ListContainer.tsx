import DisplayLog from '@/components/common/preact/DisplayLog'
import { Virtuoso } from 'react-virtuoso'
import { z } from 'astro/zod'
import { schema } from '@/services/dbLog'

type Log = z.infer<typeof schema>

type Props = {
  round: string
  data: Log[]
}

export default function ListContainer({ round, data }: Props) {
  return (
    <ul className="relative pl-0">
      <Virtuoso
        useWindowScroll
        className="min-h-8"
        data={data}
        components={{
          EmptyPlaceholder() {
            return <em>沒有紀錄</em>
          },
        }}
        itemContent={(_, item) => (
          <li key={item._id} className="list-none">
            <DisplayLog round={round} {...item} />
          </li>
        )}
      />
    </ul>
  )
}
