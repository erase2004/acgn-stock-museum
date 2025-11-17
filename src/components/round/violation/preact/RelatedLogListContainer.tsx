import DisplayLog from '@/components/common/preact/DisplayLog'
import { Virtuoso } from 'react-virtuoso'
import { z } from 'astro/zod'
import { schema } from '@/services/dbLog'
import { useState } from 'react'

type Props = {
  round: string
  data: z.infer<typeof schema>[]
}

export default function RelatedLogListContainer({ round, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <ul className="relative pl-0">
      <Virtuoso
        className="max-h-screen min-h-8"
        style={{ height }}
        totalListHeightChanged={(h) => {
          setHeight(h)
        }}
        data={data}
        components={{
          EmptyPlaceholder() {
            return <em className="mx-4">沒有任何紀錄！</em>
          },
        }}
        itemContent={(_, item) => (
          <li key={item._id} className="list-none break-all">
            <DisplayLog round={round} {...item} />
          </li>
        )}
      />
    </ul>
  )
}
