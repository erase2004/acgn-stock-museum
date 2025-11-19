import type { z } from 'astro/zod'
import type { stockSchemaExtendWithCompany } from '@/services/dbDirectors'
import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'

type Stock = z.infer<typeof stockSchemaExtendWithCompany>

type Props = {
  round: string
  data: Stock[]
}

export default function StockList({ round, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <TableVirtuoso
      className="min-h-20"
      style={{ height }}
      totalListHeightChanged={(h) => setHeight(h)}
      data={data}
      components={{
        Table({ children, ...props }) {
          return (
            <table {...props} className="table-base table">
              {children}
            </table>
          )
        },
        TableRow({ children, ...props }) {
          return (
            <tr {...props} className="*:px-1">
              {children}
            </tr>
          )
        },
        EmptyPlaceholder() {
          return (
            <tbody>
              <tr>
                <td className="text-center" colSpan={2}>
                  查無資料！
                </td>
              </tr>
            </tbody>
          )
        },
      }}
      fixedHeaderContent={() => (
        <tr className="bg-base-100 *:px-1">
          <th className="text-center text-nowrap">公司名稱</th>
          <th className="w-24 text-center text-nowrap">持股數</th>
        </tr>
      )}
      itemContent={(_, item) => (
        <Fragment key={item.companyId}>
          <td className="truncate text-left" data-title="公司名稱">
            <SimpleCompanyLink {...item} round={round} />
          </td>
          <td className="truncate text-right text-nowrap" data-title="持股數">
            {item.stocks}
          </td>
        </Fragment>
      )}
    />
  )
}
