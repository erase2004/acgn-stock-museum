import type { TypeCompanyProfitRank } from '../types'
import type { ChartData, TooltipItem } from 'chart.js'
import { currencyFormat, setChartStyle, truncateText } from '@/utils/helpers'
import { map } from 'lodash-es'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useThemeChanged } from '@/libs/hooks'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  data: TypeCompanyProfitRank
}

export default function CompanyProfitRankGraph({ data }: Props) {
  useThemeChanged(setChartStyle.bind(null, ChartJS))

  if (!data.length) return <></>

  const yAxisLabels = data.map((item) => truncateText(item.companyName, 8))
  const chartHeight = data.length * 40 + 80

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xPriceToEarn: {
        display: false,
      },
      xProfit: {
        display: false,
      },
      y: {
        display: true,
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

            if (label === '季營利額') return `${label}: $${currencyFormat(value)}`
            else return `${label}: ${value}`
          },
        },
      },
    },
  } as const

  const chartData: ChartData<'bar'> = {
    labels: yAxisLabels,
    datasets: [
      {
        label: '益本比',
        backgroundColor: 'rgba(255, 136, 0, 1)',
        data: map(data, 'priceToEarn'),
        xAxisID: 'xPriceToEarn',
      },
      {
        label: '季營利額',
        backgroundColor: 'rgba(119, 179, 0, 0.4)',
        data: map(data, 'profit'),
        xAxisID: 'xProfit',
      },
    ],
  }

  return (
    <div style={{ height: `${chartHeight}px` }}>
      <Bar options={options} data={chartData} />
    </div>
  )
}
