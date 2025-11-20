export const REPORT_TYPE = {
  PRICE: 'price',
  PROFIT: 'profit',
  VALUE: 'value',
  CAPITAL: 'capital',
  USER: 'user',
} as const

type KEY = keyof typeof REPORT_TYPE
type VALUE = (typeof REPORT_TYPE)[KEY]

export const typeNameMap = {
  price: '股票熱門排行榜',
  profit: '股票營利排行榜',
  value: '股票市值排行榜',
  capital: '公司資本額排行榜',
  user: '大富翁排行榜',
} satisfies Record<VALUE, string>

type Props = {
  currentType: VALUE
  setReportType: (value: VALUE) => void
}

export default function ReportTypeToggle({ currentType, setReportType }: Props) {
  return (
    <div className="flex flex-wrap gap-y-1">
      {Object.entries(REPORT_TYPE).map(([_, value]) => (
        <button
          key={value}
          className={`btn mr-1 btn-sm md:btn-md ${currentType === value ? 'btn-primary' : 'btn-neutral'}`}
          onClick={() => setReportType(value)}
        >
          {typeNameMap[value]}
        </button>
      ))}
    </div>
  )
}
