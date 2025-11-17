import type { FunctionComponent } from 'react'
import type { ExtendedData } from '../types'
import { Fragment } from 'react'
import PreactItemWrapper from './ItemWrapper'

type Props = {
  period: string
  list: ExtendedData[]
}

const PreactPeriod: FunctionComponent<Props> = (props) => {
  const { period, list } = props
  const pd = Number(period)

  return (
    <Fragment>
      <div className="period-title">
        {Math.floor(pd / 100)} 年 {pd % 100} 期
      </div>
      {list.map((data, index) => (
        <PreactItemWrapper data={data} index={index} />
      ))}
    </Fragment>
  )
}

export default PreactPeriod
