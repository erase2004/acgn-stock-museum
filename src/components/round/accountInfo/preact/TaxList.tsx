import type { z } from 'astro/zod'
import type { schema } from '@/services/dbTaxes'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { formatDateTimeText } from '@/libs/timeFormat'
import { currencyFormat } from '@/utils/helpers'
import { beforeTaxSeperatedRounds } from '@/configs/sites'

type Props = {
  round: string
  data: z.infer<typeof schema>[]
}

export default function TaxList({ round, data }: Props) {
  const [height, setHeight] = useState(0)

  const isBeforeTaxSeperated = beforeTaxSeperatedRounds.includes(round)

  return (
    <>
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
                  <td className="truncate" colSpan={isBeforeTaxSeperated ? 5 : 6}>
                    目前沒有需要繳納的稅金！
                  </td>
                </tr>
              </tbody>
            )
          },
        }}
        fixedHeaderContent={() => (
          <tr className="bg-base-100 *:px-1">
            <th className="w-40 text-center text-nowrap">繳稅期限</th>
            {isBeforeTaxSeperated ? (
              <th className="text-center text-nowrap">財稅額</th>
            ) : (
              <>
                <th className="text-center text-nowrap">股票資產稅</th>
                <th className="text-center text-nowrap">現金資產稅</th>
              </>
            )}
            <th className="text-center text-nowrap">殭屍稅</th>
            <th className="text-center text-nowrap">逾期罰金</th>
            <th className="text-center text-nowrap">已繳納</th>
          </tr>
        )}
        itemContent={(_, item) => (
          <Fragment key={item._id}>
            <td className="text-center text-wrap" data-title="繳稅期限">
              {formatDateTimeText(item.expireDate)}
            </td>
            {isBeforeTaxSeperated ? (
              <td className="text-right text-wrap" data-title="財稅額">
                $ {currencyFormat(item.tax)}
              </td>
            ) : (
              <>
                <td className="text-right text-wrap" data-title="股票資產稅">
                  $ {currencyFormat(item.stockTax)}
                </td>
                <td className="text-right text-wrap" data-title="現金資產稅">
                  $ {currencyFormat(item.moneyTax)}
                </td>
              </>
            )}
            <td className="text-right text-wrap" data-title="殭屍稅">
              $ {currencyFormat(item.zombieTax)}
            </td>
            <td className="text-right text-wrap" data-title="逾期罰金">
              $ {currencyFormat(item.fine)}
            </td>
            <td className="text-right text-wrap" data-title="已繳納">
              $ {currencyFormat(item.paid)}
            </td>
          </Fragment>
        )}
      />
    </>
  )
}
