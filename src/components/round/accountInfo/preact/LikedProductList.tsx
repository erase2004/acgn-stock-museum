import type { z } from 'astro/zod'
import type { schema } from '@/services/dbProductLike'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'

type ProductLike = z.infer<typeof schema>

type Props = {
  round: string
  data: ProductLike[]
}

export default function LikedProductList({ round, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <>
      <p>總共{data.length}筆</p>
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
            <th className="w-50 text-center text-nowrap">公司名稱</th>
            <th className="text-center text-nowrap">產品名稱</th>
          </tr>
        )}
        itemContent={(_, item) => (
          <Fragment key={item.productId}>
            <td className="truncate text-nowrap" data-title="公司名稱">
              <CompanyLink round={round} companyId={item.companyId} />
            </td>
            <td className="text-wrap break-all" data-title="產品名稱">
              <ProductLink productId={item.productId} />
            </td>
          </Fragment>
        )}
      />
    </>
  )
}
