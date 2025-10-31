import type { schema } from '@/services/dbPrice'
import type { z } from 'astro/zod'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import { Chart as ChartJS, TimeSeriesScale, LinearScale, Tooltip, type TooltipItem } from 'chart.js'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import { Chart } from 'react-chartjs-2'
import {
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
} from 'chartjs-chart-financial'
import { filter, map, maxBy, minBy, range } from 'lodash-es'
import { useThemeChanged } from '@/libs/hooks'
import { currencyFormat, setChartStyle } from '@/utils/helpers'
import { useStore } from '@nanostores/preact'
import { theme } from '@/stores/common'

dayjs.locale('zh-tw')
dayjs.extend(localizedFormat)
dayjs.extend(isBetween)
dayjs.extend(duration)

ChartJS.register(
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
  LinearScale,
  TimeSeriesScale,
  Tooltip,
)

type Price = z.infer<typeof schema>
type Props = {
  roundEnd: Date
  unitTime: number
  data: Price[]
}

export default function CandlestickChart({ roundEnd, unitTime, data }: Props) {
  const $theme = useStore(theme)
  useThemeChanged(setChartStyle.bind(null, ChartJS))

  // 最多 14 天
  const count = Math.min(Math.floor((86400 * 14) / unitTime) - 1, 40)
  const lastTime = Math.floor(roundEnd.getTime() / 1000 / unitTime) * unitTime * 1000
  const firstTime = dayjs(lastTime).subtract(dayjs.duration(unitTime * count, 'seconds'))

  const filterData = filter(data, (order) => {
    const orderTime = dayjs(order.createdAt)
    return orderTime.isBetween(firstTime, lastTime)
  })

  const xAxisTicks: { value: number; label: string }[] = []

  const candlestickList = map(range(count), (index) => {
    const startTime = dayjs(lastTime).subtract(
      dayjs.duration(unitTime * (count - index), 'seconds'),
    )

    xAxisTicks.push({
      value: startTime.valueOf(),
      label: '',
    })

    const priceList = filter(filterData, (order) => {
      const orderTime = dayjs(order.createdAt)
      return orderTime.isBetween(startTime, startTime.add(unitTime, 'seconds'))
    })

    return {
      x: startTime.valueOf(),
      o:
        minBy(priceList, (order) => {
          return order.createdAt
        })?.price || 0,
      c:
        maxBy(priceList, (order) => {
          return order.createdAt
        })?.price || 0,
      h:
        maxBy(priceList, (order) => {
          return order.price
        })?.price || 0,
      l:
        minBy(priceList, (order) => {
          return order.price
        })?.price || 0,
    }
  }).filter((stick) => stick.o > 0)

  const style = window.getComputedStyle(document.body)
  const upColor = style.getPropertyValue('--color-error')
  const downColor = style.getPropertyValue('--color-success')

  return (
    <div class="w-full overflow-x-auto">
      <div class="h-72 w-full min-w-xl">
        <Chart
          key={$theme}
          type="candlestick"
          data={{
            datasets: [
              {
                data: candlestickList,
                backgroundColors: {
                  up: upColor,
                  down: downColor,
                },
                borderColors: {
                  up: upColor,
                  down: downColor,
                },
                barThickness: 8,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                ticks: {
                  callback: (value: any) => {
                    return `$${currencyFormat(value)}`
                  },
                },
              },
              x: {
                type: 'time',
                min: firstTime.valueOf(),
                max: lastTime,
                bounds: 'ticks',
                time: {
                  displayFormats: {
                    datetime: 'MM/DD LT',
                    hour: 'MMMD日 LT',
                    day: 'MMMD日',
                  },
                },
                ticks: {
                  maxTicksLimit: 20,
                },
                afterBuildTicks(axis) {
                  axis.ticks = xAxisTicks.slice(0)
                },
              },
            },
            plugins: {
              tooltip: {
                usePointStyle: true,
                callbacks: {
                  label(context: TooltipItem<'candlestick'>) {
                    // @ts-expect-error: it should be ok
                    const { o = 0, h = 0, l = 0, c = 0 } = context.raw

                    return [
                      `Open:  $${currencyFormat(o)}`,
                      `High:  $${currencyFormat(h)}`,
                      `Low:   $${currencyFormat(l)}`,
                      `Close: $${currencyFormat(c)}`,
                    ]
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}
