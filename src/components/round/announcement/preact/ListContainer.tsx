import UserLink from '@/components/common/preact/UserLink'
import { formatDateTimeText } from '@/libs/timeFormat'
import { items } from '@/stores/announcement'
import { useStore } from '@nanostores/preact'
import { categoryDisplayName } from '@/utils/announcement'
import { getAnnouncementUrl } from '@/libs/routes'

type Props = {
  round: string
}

export default function ListContainer({ round }: Props) {
  const $items = useStore(items)

  return (
    <>
      <table class="table-base custom-responsive-table-md table-pin-rows table mt-4">
        <thead>
          <tr>
            <th class="truncate text-center" title="分類">
              分類
            </th>
            <th class="w-1/2 truncate text-center" title="主旨">
              主旨
            </th>
            <th class="truncate text-center" title="發佈人">
              發佈人
            </th>
            <th class="truncate text-center" title="發佈日期">
              發佈日期
            </th>
          </tr>
        </thead>
        <tbody>
          {$items.map(({ _id, category, createdAt, voided, subject, creator }) => (
            <tr key={_id}>
              <td class="truncate text-center" data-title="分類">
                {categoryDisplayName(category)}
              </td>
              <td class="truncate text-left" data-title="主旨">
                <div class="flex items-center gap-x-2">
                  {voided && <span class="badge text-nowrap badge-warning">已作廢</span>}
                  <a href={getAnnouncementUrl(round, _id)}>{subject}</a>
                </div>
              </td>
              <td class="truncate text-center" data-title="發佈人">
                <UserLink round={round} userId={creator} />
              </td>
              <td class="truncate text-center" data-title="發佈日期">
                {formatDateTimeText(createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
