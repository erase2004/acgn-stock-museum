import DisplayLog from '@/components/common/preact/DisplayLog'
import { Virtuoso } from 'react-virtuoso'
import { z } from 'astro/zod'
import { schema } from '@/services/dbLog'
import { useEffect, useState } from 'react'
import { getFSCLogJsonUrl } from '@/libs/json-data'

type Log = z.infer<typeof schema>

type Props = {
  round: string
}

export default function ListContainer({ round }: Props) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [data, setData] = useState<Log[]>([])

  useEffect(() => {
    if (isInitialized) return

    const jsonUrl = getFSCLogJsonUrl(round)
    import(/* @vite-ignore */ jsonUrl)
      .then((module) => {
        const result = schema.array().parse(module.data)
        setData(result)
      })
      .finally(() => setIsInitialized(true))
  }, [])

  if (!isInitialized) {
    return <span className="loading loading-xl loading-spinner"> </span>
  }

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
