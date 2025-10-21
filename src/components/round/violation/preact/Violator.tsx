import type { violatorSchema } from '@/services/dbViolationCases'
import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import UserLink from '@/components/common/preact/UserLink'

type Props = z.infer<typeof violatorSchema> & { round: string }

export default function Violator({ violatorType, violatorId, round }: Props) {
  let jsx: preact.JSX.Element

  switch (violatorType) {
    case 'user': {
      jsx = (
        <>
          使用者 <UserLink round={round} userId={violatorId} />
        </>
      )
      break
    }
    case 'company': {
      jsx = (
        <>
          公司「
          <CompanyLink round={round} companyId={violatorId} />」
        </>
      )
      break
    }
    case 'product': {
      jsx = (
        <>
          產品「
          <ProductLink round={round} productId={violatorId} />」
        </>
      )
      break
    }
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = violatorType
      jsx = <></>
      break
    }
  }

  return (
    <>
      {jsx}({violatorId})
    </>
  )
}
