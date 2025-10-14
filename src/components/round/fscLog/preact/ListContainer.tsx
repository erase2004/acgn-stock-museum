import { z } from 'astro/zod'
import { logsWithCountSchema } from '@/services/dbLog'
import { useEffect, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { currentPage, isDataLoading } from '@/stores/pagination'
import { getFSCLogs } from '@/libs/request'
import DisplayLog from '@/components/common/preact/DisplayLog'
import { formatDateTimeText } from '@/libs/timeFormat'

type Props = {
  round: string
  pageSize: number
  data: z.infer<typeof logsWithCountSchema>
}

export default function ListContainer({ round, pageSize, data }: Props) {
  const [items, setItems] = useState(data[0]?.data ?? [])
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)

  useEffect(() => {
    if ($isDataLoading) return

    isDataLoading.set(true)
    getFSCLogs(round, pageSize, $currentPage).then(async (response) => {
      const data = await z.promise(logsWithCountSchema).parse(response.json())

      isDataLoading.set(false)

      if (data) {
        setItems(data[0]?.data ?? [])
      }
    })
  }, [$currentPage])

  return (
    <ul class="relative">
      {items.map((d) => (
        <li>
          <time class="mr-2 text-primary">({formatDateTimeText(d.createdAt)})</time>
          <DisplayLog round={round} {...d} />
        </li>
      ))}
      {$isDataLoading === true && (
        <div class="absolute inset-0 flex items-center justify-center bg-base-300/50">
          <span class="loading w-24 loading-spinner"></span>
        </div>
      )}
    </ul>
  )
}
