import type { schema as schemaEmployee } from '@/services/dbEmployees'
import type { z } from 'astro/zod'
import CompanyTitle from './CompanyTitle'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/account'

type Employee = z.infer<typeof schemaEmployee>

type Props = {
  round: string
  data: (Pick<Employee, '_id' | 'companyId' | 'employed'> & { isSeal: boolean })[]
}

const PAGE_SIZE = 10
const STORE_KEY = 'employee-title'

export default function EmployeeTitleList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      {displayItems.length > 0
        ? displayItems.map((item) => (
            <CompanyTitle
              key={item._id}
              round={round}
              companyId={item.companyId}
              isSeal={item.isSeal}
              title={item.employed ? '員工' : '儲備員工'}
            />
          ))
        : '查無資料！'}
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
