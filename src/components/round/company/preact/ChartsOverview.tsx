import LineChart from './LineChart'
import CandlestickChart from './CandlestickChart'
import RangeSlider from 'react-range-slider-input'
import type { schema } from '@/services/dbPrice'
import type { z } from 'astro/zod'
import { useState } from 'preact/hooks'
import dayjs from 'dayjs'

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
  const upper = dayjs(roundEnd).valueOf()
  const lower = dayjs(roundEnd).subtract(14, 'days').valueOf()
  const [bounds, setBounds] = useState([lower, upper])
  const [min, max] = bounds

  let chartJsx: preact.JSX.Element = <></>

  switch (mode) {
    case 'full': {
      chartJsx = <LineChart data={data} min={min} max={max} />
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
      const _unreachable: never = mode
      break
    }
  }

  return (
    <div class="grid grid-cols-1 gap-y-6 md:auto-cols-min md:grid-cols-[1fr_50px]">
      <div class="overflow-x-hidden max-md:w-full">{chartJsx}</div>
      {mode === 'full' && (
        <div class="w-3/5 min-w-60 justify-self-center md:row-start-2">
          <RangeSlider
            min={lower}
            max={upper}
            step={1000 * modeToTimeUnit['4hours'].value}
            value={bounds}
            onInput={setBounds}
          />
        </div>
      )}
      <div class="join-horizontal join self-center justify-self-center md:join-vertical">
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
