import type { schema } from '@/services/dbDirectors'
import type { z } from 'astro/zod'
import UserLink from '@/components/common/preact/UserLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { getStockPercentage } from '@/utils/company'

type Director = z.infer<typeof schema>
type Props = {
  round: string
  totalRelease: number
  data: Director[]
}

export default function DirectorList({ round, totalRelease, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <>
      <TableVirtuoso
        className="company-panel-table max-h-72 min-h-8 border-t md:min-h-16"
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
          TableRow({ children, ...props }) {
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
            return <em className="block text-center">沒有任何董事！</em>
          },
        }}
        fixedHeaderContent={() => (
          <>
            <div className="col-span-3">使用者帳號</div>
            <div className="col-span-2 lg:col-span-1">股份數</div>
            <div className="col-span-2 lg:col-span-1">比例</div>
            <div className="col-span-5 lg:col-span-7">留言</div>
          </>
        )}
        itemContent={(_, item) => (
          <Fragment key={item.userId}>
            <p className="col-span-4 text-nowrap md:hidden">使用者帳號</p>
            <div className="col-span-8 truncate md:col-span-3">
              <UserLink round={round} userId={item.userId} />
            </div>
            <p className="col-span-4 md:hidden">股份數</p>
            <div
              className="col-span-8 truncate text-right md:col-span-2 lg:col-span-1"
              title={`${item.stocks}`}
            >
              {item.stocks}
            </div>
            <p className="col-span-4 md:hidden">比例</p>
            <div className="col-span-8 text-right md:col-span-2 lg:col-span-1">
              {getStockPercentage(item.stocks, totalRelease)}%
            </div>
            <p className="col-span-4 md:hidden">留言</p>
            <div className="col-span-8 break-all md:col-span-5 lg:col-span-7">
              {item.message || '無'}
            </div>
          </Fragment>
        )}
      />
      {data.length > 0 && <p>總共{data.length}位股東</p>}
    </>
  )
}
