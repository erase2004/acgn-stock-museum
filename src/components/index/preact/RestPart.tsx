import type { ExtendedData } from '../types'
import { Fragment, useEffect, useState, type FunctionComponent } from 'react'
import PreactPeriod from './Period'
import { useIntersectionObserver } from 'usehooks-ts'

type Props = {
  data: [string, ExtendedData[]][]
}

const PreactRestPart: FunctionComponent<Props> = ({ data }) => {
  const { isIntersecting, ref } = useIntersectionObserver({ rootMargin: '0px 0px 1800px 0px' })

  const totalAmount = data.length
  const step = 2
  const [displayAmount, setDisplayAmount] = useState(0)
  const displayList = data.slice(0, displayAmount)

  useEffect(() => {
    if (isIntersecting) {
      if (displayAmount >= totalAmount) return

      setDisplayAmount(displayAmount + step)
    }
  }, [isIntersecting])

  return (
    <Fragment>
      {displayList.map(([period, list]) => (
        <PreactPeriod key={period} period={period} list={list} />
      ))}
      <div ref={ref} className="h-5 w-full"></div>
    </Fragment>
  )
}

export default PreactRestPart
