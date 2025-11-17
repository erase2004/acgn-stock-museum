import type { schema } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import ProductLink from '@/components/common/preact/ProductLink'
import { Fragment } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { isRestrictedRating } from '@/utils/product'
import { isGreaterThanMd } from '@/utils/helpers'
import { useWindowSize } from 'usehooks-ts'

type Product = z.infer<typeof schema>
type Props = {
  data: Product[]
}

export default function ProductListForFirstRound({ data }: Props) {
  const { width } = useWindowSize()

  if (data.length === 0) {
    return <em>哦不！本季沒有推出任何產品！</em>
  }

  const height = isGreaterThanMd(width)
    ? Math.max(1, Math.min(3, Math.ceil(data.length / 2))) * 140
    : Math.max(1, Math.min(3, data.length)) * 140

  return (
    <>
      <VirtuosoGrid
        className="max-h-96"
        style={{ minHeight: 140, height }}
        data={data}
        listClassName={'grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2'}
        components={{
          Item({ children }) {
            return <Fragment>{children}</Fragment>
          },
        }}
        itemContent={(_, item) => <ProductCard key={item._id} item={item} />}
      />
    </>
  )
}

type CardProps = {
  item: Product
}

function ProductCard({ item: { _id, rating, type, description, voteCount } }: CardProps) {
  return (
    <div className="card-border card col-span-full overflow-hidden border-base-content/25 md:col-span-1">
      <div className="card-title flex justify-between bg-base-200 px-4 py-2 text-base font-normal">
        <small>識別碼：{_id}</small>
        <span className="badge items-baseline badge-soft badge-info">
          {voteCount}
          <i className="fa fa-money" aria-hidden="true"></i>
        </span>
      </div>
      <div className="card-body p-4">
        <div className="flex gap-1 text-xl text-nowrap *:last:truncate">
          <span className="badge badge-neutral">{type}</span>
          {isRestrictedRating(rating) && <span className="badge badge-error">{rating}</span>}
          <ProductLink productId={_id} />
        </div>
        <p>{description}</p>
      </div>
    </div>
  )
}
