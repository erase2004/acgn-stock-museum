import type { schema as schemaProduct } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import ProductLink from '@/components/common/preact/ProductLink'
import { Fragment } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { isRestrictedRating, useProductCenter } from '@/utils/product'

type Props = {
  data: z.infer<typeof schemaProduct>[]
}

export default function CompanyListContainer({ data }: Props) {
  const { displayItems, handleSortChange, getSortButtonClass, getSortIcon } = useProductCenter(data)

  return (
    <>
      <p>總共{displayItems.length}項產品</p>
      <div className="sticky-control flex gap-x-2 py-4 md:hidden">
        <button
          className={`btn-default btn btn-outline btn-sm ${getSortButtonClass('type')}`}
          onClick={() => {
            handleSortChange('type')
          }}
        >
          類別
          {getSortIcon('type')}
        </button>
        <button
          className={`btn-default btn btn-outline btn-sm ${getSortButtonClass('rating')}`}
          onClick={() => {
            handleSortChange('rating')
          }}
        >
          分級
          {getSortIcon('rating')}
        </button>
        <button
          className={`btn-default btn btn-outline btn-sm ${getSortButtonClass('voteCount')}`}
          onClick={() => {
            handleSortChange('voteCount')
          }}
        >
          得票數
          {getSortIcon('voteCount')}
        </button>
      </div>
      <TableVirtuoso
        useWindowScroll
        className="min-h-10 md:min-h-20"
        data={displayItems}
        fixedHeaderContent={() => (
          <tr className="bg-base-100">
            <th className="text-center">產品</th>
            <th
              className="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('type')
              }}
            >
              類別
              {getSortIcon('type')}
            </th>
            <th
              className="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('rating')
              }}
            >
              分級
              {getSortIcon('rating')}
            </th>
            <th
              className="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('voteCount')
              }}
            >
              得票數
              {getSortIcon('voteCount')}
            </th>
          </tr>
        )}
        components={{
          Table({ children, ...props }) {
            return (
              <table {...props} className="table-base custom-responsive-table-md table">
                {children}
              </table>
            )
          },
          EmptyPlaceholder() {
            return (
              <tbody>
                <tr className="default-content">
                  <td colSpan={4}>這家公司尚未推出任何產品！</td>
                </tr>
              </tbody>
            )
          },
        }}
        itemContent={(_, item) => (
          <Fragment key={item.companyId}>
            <td className="text-left" data-title="產品">
              <div className="break-all">
                <ProductLink productId={item._id} />
              </div>
              <div className="text-sm break-all">{item.description}</div>
            </td>
            <td className="text-center text-nowrap" data-title="類別">
              {item.type}
            </td>
            {isRestrictedRating(item.rating) ? (
              <td
                className="text-center text-nowrap text-error before:text-base-content"
                data-title="分級"
              >
                {item.rating}
              </td>
            ) : (
              <td className="text-center text-nowrap" data-title="分級">
                &nbsp;
              </td>
            )}

            <td className="text-center text-nowrap" data-title="得票數">
              <span className="badge items-baseline badge-soft text-base badge-info">
                {item.voteCount}
                <i className="fa fa-ticket" aria-hidden="true"></i>
              </span>
            </td>
          </Fragment>
        )}
      />
    </>
  )
}
