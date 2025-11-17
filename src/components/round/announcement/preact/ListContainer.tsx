import UserLink from '@/components/common/preact/UserLink'
import { Fragment } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { formatDateTimeText } from '@/libs/timeFormat'
import { items } from '@/stores/announcement'
import { useStore } from '@nanostores/react'
import { categoryDisplayName } from '@/utils/announcement'
import { getAnnouncementUrl } from '@/libs/routes'

type Props = {
  round: string
}

export default function ListContainer({ round }: Props) {
  const $items = useStore(items)

  return (
    <>
      <TableVirtuoso
        useWindowScroll
        data={$items}
        components={{
          Table({ children, ...props }) {
            return (
              <table {...props} className="table-base custom-responsive-table-md table">
                {children}
              </table>
            )
          },
          TableRow({ children, ...props }) {
            return (
              <tr {...props} className="*:px-2">
                {children}
              </tr>
            )
          },
        }}
        fixedHeaderContent={() => (
          <tr className="bg-base-100">
            <th className="w-32 text-center" title="分類">
              分類
            </th>
            <th className="w-2/5 text-center" title="主旨">
              主旨
            </th>
            <th className="text-center" title="發佈人">
              發佈人
            </th>
            <th className="w-52 text-center" title="發佈日期">
              發佈日期
            </th>
          </tr>
        )}
        itemContent={(_, { _id, category, createdAt, voided, subject, creator }) => (
          <Fragment key={_id}>
            <td className="text-center" data-title="分類">
              {categoryDisplayName(category)}
            </td>
            <td className="text-left" data-title="主旨">
              <div className="flex items-center gap-x-2">
                {voided && <span className="badge text-nowrap badge-warning">已作廢</span>}
                <a href={getAnnouncementUrl(round, _id)}>{subject}</a>
              </div>
            </td>
            <td className="truncate text-center" data-title="發佈人">
              <UserLink round={round} userId={creator} />
            </td>
            <td className="text-center max-md:text-wrap md:truncate" data-title="發佈日期">
              {formatDateTimeText(createdAt)}
            </td>
          </Fragment>
        )}
      />
    </>
  )
}
