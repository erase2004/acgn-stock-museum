import type { schema } from '@/services/dbEmployees'
import type { z } from 'astro/zod'
import UserLink from '@/components/common/preact/UserLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { formatDateTimeText } from '@/libs/timeFormat'

type EmployeeType = 'current' | 'next'
type Employee = z.infer<typeof schema>
type Props = {
  type: EmployeeType
  round: string
  data: Employee[]
}

function typeLabel(type: EmployeeType) {
  return type === 'current' ? '在職員工' : '儲備員工'
}

function thirdColTitle(type: EmployeeType) {
  return type === 'current' ? '留言' : ''
}

function showMessage(type: EmployeeType, message?: string) {
  return type === 'current' ? message || '無' : ''
}

export default function EmployeeList({ type, round, data }: Props) {
  const label = typeLabel(type)

  const [height, setHeight] = useState(0)

  return (
    <div className="-mx-2 border-t border-base-content/25 px-2 md:-mx-4 md:px-4">
      <p className="my-1 text-xl">
        {label}
        <span className="ml-4 text-base">-總共{data.length}人-</span>
      </p>
      <TableVirtuoso
        className="company-panel-table max-h-72 min-h-8 md:min-h-16"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={data}
        components={{
          Table({ children, ...props }) {
            return <div {...props}>{children}</div>
          },
          TableHead({ children, ...props }) {
            return (
              <div {...props} className="head">
                {children}
              </div>
            )
          },
          TableBody({ children, ...props }) {
            return <div {...props}>{children}</div>
          },
          TableRow({ children, item, ...props }) {
            return (
              <div {...props} className="row">
                {children}
              </div>
            )
          },
          FillerRow({ height }) {
            return <div style={{ height }}></div>
          },
          EmptyPlaceholder() {
            return <div className="text-center">沒有{label}！</div>
          },
        }}
        fixedHeaderContent={() => (
          <>
            <div className="col-span-3">使用者帳號</div>
            <div className="col-span-4">報名時間</div>
            <div className="col-span-5">{thirdColTitle(type)}</div>
          </>
        )}
        itemContent={(_, item) => (
          <Fragment key={item.userId}>
            <p className="col-span-5 md:hidden">使用者帳號</p>
            <div className="col-span-7 truncate md:col-span-3">
              <UserLink round={round} userId={item.userId} />
            </div>
            <p className="col-span-5 md:hidden">報名時間</p>
            <div className="col-span-7 text-left md:col-span-4 md:text-center">
              {formatDateTimeText(item.registerAt)}
            </div>
            <p className="col-span-5 md:hidden">{thirdColTitle(type)}</p>
            <div className="col-span-7 md:col-span-5">{showMessage(type, item.message)}</div>
          </Fragment>
        )}
      />
    </div>
  )
}
