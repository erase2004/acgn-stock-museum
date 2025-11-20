import UserLink from '@/components/common/preact/UserLink'
import { Fragment, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { getStockPercentage } from '@/utils/company'

type Candidate = {
  id: string
  votes: number
  list: string[]
}

type Props = {
  round: string
  totalRelease: number
  data: Candidate[]
}

export default function ManagerElectionInfo({ round, totalRelease, data }: Props) {
  const [height, setHeight] = useState(0)

  return (
    <div>
      <p className="mb-2 text-xl">選舉下個商業季度的負責經理人：</p>
      <TableVirtuoso
        className="company-panel-table max-h-72 min-h-8 md:min-h-16"
        style={{ height }}
        totalListHeightChanged={(h) => setHeight(h)}
        data={data}
        components={{
          Table({ children, ...props }) {
            return <div {...props}>{children}</div>
          },
          TableHead({ children, ...props }) {
            return (
              <div {...props} className="head">
                {children}
              </div>
            )
          },
          TableBody({ children, ...props }) {
            return <div {...props}>{children}</div>
          },
          TableRow({ children, ...props }) {
            return (
              <div {...props} className="row">
                {children}
              </div>
            )
          },
          FillerRow({ height }) {
            return <div style={{ height }}></div>
          },
          EmptyPlaceholder() {
            return <em className="block text-center">沒有任何候選人！</em>
          },
        }}
        fixedHeaderContent={() => (
          <>
            <div className="col-span-6">候選人</div>
            <div className="col-span-2">支持率</div>
            <div className="col-span-4">支持者</div>
          </>
        )}
        itemContent={(_, item) => (
          <Fragment key={item.id}>
            <p className="col-span-3 md:hidden">候選人</p>
            <div className="col-span-9 truncate md:col-span-6">
              <UserLink round={round} userId={item.id} />
            </div>
            <p className="col-span-3 md:hidden">支持率</p>
            <div className="col-span-9 text-right md:col-span-2 md:text-center">
              {getStockPercentage(item.votes, totalRelease)}%
            </div>
            <p className="col-span-3 md:hidden">支持者</p>
            <div className="col-span-9 text-right md:col-span-4 md:text-center">
              {item.list.length > 0 ? <VoteInfo round={round} list={item.list} /> : '無'}
            </div>
          </Fragment>
        )}
      />
    </div>
  )
}

function VoteInfo({ round, list }: { round: string; list: string[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button className="btn p-4 btn-sm btn-primary" onClick={() => setIsOpen(true)}>
        清單 <i className="fa fa-users" aria-hidden="true"></i>
      </button>
      <dialog className="modal" open={isOpen}>
        <div className="modal-box max-w-96 text-left">
          <button
            className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
            aria-label="close dialog"
            onClick={() => setIsOpen(false)}
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          <ol>
            {list.map((directorId) => (
              <li key={directorId} className="*:block *:truncate">
                <UserLink round={round} userId={directorId} />
              </li>
            ))}
          </ol>
        </div>
      </dialog>
    </>
  )
}
