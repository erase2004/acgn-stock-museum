import type { z } from 'astro/zod'
import type { schema as schemaCompanyStone } from '@/services/dbCompanyStones'
import CompanyLink from '@/components/common/preact/CompanyLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { stoneDisplayName } from '@/utils/stone'

type Props = {
  round: string
  data: z.infer<typeof schemaCompanyStone>[]
}

export default function StoneList({ round, data }: Props) {
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
          <th className="w-24 text-center text-nowrap">石頭類型</th>
        </tr>
      )}
      itemContent={(_, item) => (
        <Fragment key={item.companyId}>
          <td className="truncate text-left text-nowrap" data-title="公司名稱">
            <CompanyLink round={round} companyId={item.companyId} />
          </td>
          <td className="truncate text-center text-nowrap" data-title="石頭類型">
            {stoneDisplayName(item.stoneType)}
          </td>
        </Fragment>
      )}
    />
  )
}
