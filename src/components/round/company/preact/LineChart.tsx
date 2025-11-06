import type { schema } from '@/services/dbPrice'
import type { z } from 'astro/zod'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import {
  Chart as ChartJS,
  TimeSeriesScale,
  LinearScale,
  LineController,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  type TooltipItem,
} from 'chart.js'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import { Chart } from 'react-chartjs-2'
import { useThemeChanged } from '@/libs/hooks'
import { currencyFormat, setChartStyle } from '@/utils/helpers'
import { useStore } from '@nanostores/preact'
import { theme } from '@/stores/common'

dayjs.locale('zh-tw')
dayjs.extend(localizedFormat)

ChartJS.register(
  Title,
  LineController,
  LinearScale,
  TimeSeriesScale,
  Tooltip,
  PointElement,
  LineElement,
)

type Price = z.infer<typeof schema>
type Props = {
  data: Price[]
  min: number
  max: number
}

export default function LineChart({ data, min, max }: Props) {
  const $theme = useStore(theme)
  useThemeChanged(setChartStyle.bind(null, ChartJS))

  const style = window.getComputedStyle(document.body)
  const color = style.getPropertyValue('--color-info')

  return (
    <div class="w-full overflow-x-auto">
      <div class="h-80 w-full min-w-xl">
        <Chart
          key={$theme}
          type="line"
          data={{
            datasets: [
              {
                data: data,
                parsing: {
                  xAxisKey: 'createdAt',
                  yAxisKey: 'price',
                },
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
                min: min,
                max: max,
                type: 'time',
                bounds: 'ticks',
                time: {
                  minUnit: 'day',
                  displayFormats: {
                    datetime: 'MM/DD LT',
                    day: 'MMMD日',
                  },
                },
                ticks: {
                  maxTicksLimit: 20,
                },
              },
            },
            elements: {
              line: {
                borderColor: color,
              },
              point: {
                backgroundColor: color,
                borderColor: color,
              },
            },
            plugins: {
              title: {
                display: true,
                text: '14日間股價走勢圖',
                font: {
                  size: 16,
                },
              },
              tooltip: {
                usePointStyle: true,
                callbacks: {
                  label(context: TooltipItem<'line'>) {
                    // @ts-expect-error: treat context.raw as any
                    const { price } = context.raw

                    return `價格: $${currencyFormat(price)}`
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
