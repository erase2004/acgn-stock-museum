import LineChart from './LineChart'
import CandlestickChart from './CandleStickChart'
import type { schema } from '@/services/dbPrice'
import type { z } from 'astro/zod'
import { useState } from 'preact/hooks'

const modeToTimeUnit = {
  full: {
    title: '走勢',
    value: 0,
  },
  '1day': {
    title: '日K',
    value: 86400,
  },
  '12hours': {
    title: '12時',
    value: 43200,
  },
  '4hours': {
    title: '4時',
    value: 14400,
  },
  '2hours': {
    title: '2時',
    value: 7200,
  },
  '1hour': {
    title: '1時',
    value: 3600,
  },
} as const

type Mode = keyof typeof modeToTimeUnit

type Price = z.infer<typeof schema>
type Props = {
  roundEnd: Date
  data: Price[]
}

export default function ChartsOverview({ roundEnd, data }: Props) {
  const [mode, setMode] = useState<Mode>('full')

  let chartJsx: preact.JSX.Element = <></>

  switch (mode) {
    case 'full': {
      chartJsx = <LineChart roundEnd={roundEnd} data={data} />
      break
    }
    case '1day':
    case '12hours':
    case '4hours':
    case '2hours':
    case '1hour': {
      chartJsx = (
        <CandlestickChart roundEnd={roundEnd} unitTime={modeToTimeUnit[mode].value} data={data} />
      )
      break
    }
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = mode
      break
    }
  }

  return (
    <div class="flex flex-col items-center gap-4 md:flex-row">
      <div class="grow overflow-x-hidden max-md:w-full">{chartJsx}</div>
      <div class="join-horizontal join shrink-0 grow-0 md:join-vertical">
        {Object.entries(modeToTimeUnit).map(([m, item]) => (
          <button
            key={m}
            class={`btn join-item btn-xs ${mode === m ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode(m as Mode)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  )
}
