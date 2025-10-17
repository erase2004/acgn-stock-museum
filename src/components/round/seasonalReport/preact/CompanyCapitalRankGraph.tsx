import type { TypeCompanyCapitalRank } from '../types'
import type { ChartData, TooltipItem } from 'chart.js'
import { currencyFormat, setChartStyle } from '@/utils/helpers'
import { map } from 'lodash-es'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useThemeChanged } from '@/libs/hooks'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  data: TypeCompanyCapitalRank
}

export default function CompanyCapitalRankGraph({ data }: Props) {
  useThemeChanged(setChartStyle.bind(null, ChartJS))

  if (!data.length) return <></>

  const yAxisLabels = data.map((item) => item.companyName)
  const chartHeight = data.length * 60 + 125

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xCapital: {
        display: false,
      },
      xValue: {
        display: false,
      },
      xRelease: {
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

            if (['總市值', '資本額'].includes(label)) return `${label}: $${currencyFormat(value)}`
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
        label: '資本額',
        backgroundColor: 'rgba(119, 179, 0, 1)',
        data: map(data, 'capital'),
        xAxisID: 'xCapital',
      },
      {
        label: '總市值',
        backgroundColor: 'rgba(255, 136, 0, 0.4)',
        data: map(data, 'totalValue'),
        xAxisID: 'xValue',
      },
      {
        label: '總釋股數',
        backgroundColor: 'rgba(42, 159, 214, 0.4)',
        data: map(data, 'totalRelease'),
        xAxisID: 'xRelease',
      },
    ],
  }

  return (
    <div style={{ height: `${chartHeight}px` }}>
      <Bar options={options} data={chartData} />
    </div>
  )
}
