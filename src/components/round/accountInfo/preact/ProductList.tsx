import type { z } from 'astro/zod'
import type { schema } from '@/services/dbUserOwnedProduct'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'

type Product = Pick<z.infer<typeof schema>, 'productId' | 'companyId' | 'amount'>

type Props = {
  round: string
  data: Product[]
}

export default function ProductList({ round, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <>
      <p>總共{data.length}筆</p>
      <TableVirtuoso
        className="min-h-10 md:min-h-20"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={data}
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
              <tr {...props} className="*:px-1">
                {children}
              </tr>
            )
          },
          EmptyPlaceholder() {
            return (
              <tbody>
                <tr className="default-content">
                  <td colSpan={3}>查無資料！</td>
                </tr>
              </tbody>
            )
          },
        }}
        fixedHeaderContent={() => (
          <tr className="bg-base-100 *:px-1">
            <th className="w-50 text-center text-nowrap">公司名稱</th>
            <th className="text-center text-nowrap">產品名稱</th>
            <th className="w-24 text-center text-nowrap">持有數量</th>
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
            <td className="truncate text-nowrap md:text-center" data-title="持有數量">
              {item.amount}
            </td>
          </Fragment>
        )}
      />
    </>
  )
}
