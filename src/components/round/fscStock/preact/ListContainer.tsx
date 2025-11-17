import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { Fragment } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { z } from 'astro/zod'
import { stockSchemaExtendWithCompany } from '@/services/dbDirectors'

type Stock = z.infer<typeof stockSchemaExtendWithCompany>
type Props = {
  round: string
  data: Stock[]
}

export default function ListContainer({ round, data }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <p>總共{data.length}筆</p>
      <TableVirtuoso
        useWindowScroll
        className="min-h-20"
        data={data}
        components={{
          Table({ children, ...props }) {
            return (
              <table {...props} className="table-base table">
                {children}
              </table>
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
          <tr className="bg-base-100">
            <th className="text-center" title="公司名稱">
              公司名稱
            </th>
            <th className="w-1/3 text-center" title="持有股數">
              持有股數
            </th>
          </tr>
        )}
        itemContent={(_, item) => (
          <Fragment key={item.companyId}>
            <td>
              <SimpleCompanyLink {...item} round={round} />
            </td>
            <td className="text-right">{item.stocks} 股</td>
          </Fragment>
        )}
      />
    </div>
  )
}
