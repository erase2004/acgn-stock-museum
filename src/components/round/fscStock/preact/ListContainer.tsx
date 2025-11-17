import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { z } from 'astro/zod'
import { stockSchemaExtendWithCompany } from '@/services/dbDirectors'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage } from '@/configs/general'
import { useStore } from '@nanostores/react'
import { totalAmount } from '@/stores/pagination'

const PAGE_SIZE = dataNumberPerPage.fscStock

type Stock = z.infer<typeof stockSchemaExtendWithCompany>
type Props = {
  storeKey: string
  round: string
  data: Stock[]
}

export default function ListContainer({ storeKey, round, data }: Props) {
  const $totalAmount = useStore(totalAmount)
  const displayItems = useDisplayItems(data, storeKey, PAGE_SIZE)

  let tbodyContent

  if (!data.length) {
    tbodyContent = (
      <tr>
        <td className="text-center" colSpan={2}>
          查無資料！
        </td>
      </tr>
    )
  } else {
    tbodyContent = displayItems.map((item) => (
      <tr key={item.companyId}>
        <td>
          <SimpleCompanyLink {...item} round={round} />
        </td>
        <td className="text-right">{item.stocks} 股</td>
      </tr>
    ))
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p>總共{$totalAmount[storeKey]}筆</p>
      <table className="table-pin-rows table-base table">
        <thead>
          <tr>
            <th className="text-center" title="公司名稱">
              公司名稱
            </th>
            <th className="w-1/3 text-center" title="持有股數">
              持有股數
            </th>
          </tr>
        </thead>
        <tbody>{tbodyContent}</tbody>
      </table>
    </div>
  )
}
