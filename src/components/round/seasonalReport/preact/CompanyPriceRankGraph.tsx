import type { TypeCompanyPriceRank } from '../types'
import type { ChartData, TooltipItem } from 'chart.js'
import { currencyFormat, setChartStyle, toCurrencyAbbr } from '@/utils/helpers'
import { map } from 'lodash-es'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useThemeChanged } from '@/libs/hooks'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  data: TypeCompanyPriceRank
}

export default function CompanyPriceRankGraph({ data }: Props) {
  useThemeChanged(setChartStyle.bind(null, ChartJS))

  if (!data.length) return <></>

  const yAxisLabels = data.map((item) => item.companyName)
  const chartHeight = data.length * 20 + 125

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        position: 'top',
        stacked: true,
        ticks: {
          callback: function (value: any) {
            return toCurrencyAbbr(value)
          },
        },
      },
      x2: {
        position: 'bottom',
        stacked: true,
        afterBuildTicks: (axis: any) => {
          axis.ticks = [...axis.chart.scales.x.ticks]
          axis.min = axis.chart.scales.x.min
          axis.max = axis.chart.scales.x.max
        },
        ticks: {
          callback: function (value: any) {
            return toCurrencyAbbr(value)
          },
        },
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function (context: TooltipItem<'bar'>) {
            const label = context.dataset.label || ''
            const value = context.raw

            return `${label}: $${currencyFormat(value, { maximumFractionDigits: 0 })}`
          },
        },
      },
    },
  } as const

  const chartData: ChartData<'bar'> = {
    labels: yAxisLabels,
    datasets: [
      {
        label: '季成交額',
        backgroundColor: '#77b300',
        data: map(data, 'totalDealMoney'),
      },
      {
        label: '產品營利',
        backgroundColor: '#ff8800',
        data: map(data, 'productProfit'),
      },
    ],
  }

  return (
    <div style={{ height: `${chartHeight}px` }}>
      <Bar options={options} data={chartData} />
    </div>
  )
}
