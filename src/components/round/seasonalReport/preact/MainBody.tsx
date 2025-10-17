import type {
  TypeCompanyCapitalRank,
  TypeCompanyPriceRank,
  TypeCompanyProfitRank,
  TypeCompanyValueRank,
  TypeUserWealthRank,
} from '../types'
import { useState } from 'preact/hooks'
import ReportTypeToggle, { REPORT_TYPE, typeNameMap } from './ReportTypeToggle'
import CompanyPriceRankTable from './CompanyPriceRankTable'
import CompanyProfitRankTable from './CompanyProfitRankTable'
import CompanyValueRankTable from './CompanyValueRankTable'
import CompanyCapitalRankTable from './CompanyCapitalRankTable'
import UserWealthRankTable from './UserWealthRankTable'
import CompanyPriceRankGraph from './CompanyPriceRankGraph'
import CompanyValueRankGraph from './CompanyValueRankGraph'
import CompanyProfitRankGraph from './CompanyProfitRankGraph'
import CompanyCapitalRankGraph from './CompanyCapitalRankGraph'
import UserWealthRankGraph from './UserRankGraph'

const REPORT_MODE = {
  TABLE: 'table',
  GRAPH: 'graph',
}

type Props = {
  round: string
  rankCompanyCapitalData: TypeCompanyCapitalRank
  rankCompanyPriceData: TypeCompanyPriceRank
  rankCompanyProfitData: TypeCompanyProfitRank
  rankCompanyValueData: TypeCompanyValueRank
  rankUserWealthData: TypeUserWealthRank
}

export default function MainBody({
  round,
  rankCompanyCapitalData,
  rankCompanyPriceData,
  rankCompanyProfitData,
  rankCompanyValueData,
  rankUserWealthData,
}: Props) {
  const [reportType, setReportType] = useState<(typeof REPORT_TYPE)[keyof typeof REPORT_TYPE]>(
    REPORT_TYPE.PRICE,
  )
  const [reportMode, setReportMode] = useState(REPORT_MODE.TABLE)

  const reportTitle = typeNameMap[reportType]
  const modeText = reportMode === REPORT_MODE.GRAPH ? '圖表模式' : '表格模式'

  let tableJsx: preact.JSX.Element = <></>
  switch (reportType) {
    case REPORT_TYPE.PRICE: {
      tableJsx = <CompanyPriceRankTable round={round} data={rankCompanyPriceData} />
      break
    }
    case REPORT_TYPE.PROFIT: {
      tableJsx = <CompanyProfitRankTable round={round} data={rankCompanyProfitData} />
      break
    }
    case REPORT_TYPE.VALUE: {
      tableJsx = <CompanyValueRankTable round={round} data={rankCompanyValueData} />
      break
    }
    case REPORT_TYPE.CAPITAL: {
      tableJsx = <CompanyCapitalRankTable round={round} data={rankCompanyCapitalData} />
      break
    }
    case REPORT_TYPE.USER: {
      tableJsx = <UserWealthRankTable round={round} data={rankUserWealthData} />
      break
    }
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = reportType
      break
    }
  }

  let graphJsx: preact.JSX.Element = <></>
  switch (reportType) {
    case REPORT_TYPE.PRICE: {
      graphJsx = <CompanyPriceRankGraph data={rankCompanyPriceData} />
      break
    }
    case REPORT_TYPE.PROFIT: {
      graphJsx = <CompanyProfitRankGraph data={rankCompanyProfitData} />
      break
    }
    case REPORT_TYPE.VALUE: {
      graphJsx = <CompanyValueRankGraph data={rankCompanyValueData} />
      break
    }
    case REPORT_TYPE.CAPITAL: {
      graphJsx = <CompanyCapitalRankGraph data={rankCompanyCapitalData} />
      break
    }
    case REPORT_TYPE.USER: {
      graphJsx = <UserWealthRankGraph data={rankUserWealthData} />
      break
    }
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = reportType
      break
    }
  }

  function handleClickOnModeButton() {
    setReportMode(reportMode === REPORT_MODE.TABLE ? REPORT_MODE.GRAPH : REPORT_MODE.TABLE)
  }

  return (
    <>
      <div class="flex flex-wrap gap-y-1">
        <ReportTypeToggle currentType={reportType} setReportType={setReportType} />
        <button onClick={handleClickOnModeButton} class="btn ml-auto btn-outline">
          {modeText}
        </button>
      </div>
      <div class="divider"></div>
      <h2 class="text-3xl">{reportTitle}</h2>
      <div class="w-full overflow-x-auto">
        <div class="w-full min-w-2xl">{reportMode === REPORT_MODE.GRAPH ? graphJsx : tableJsx}</div>
      </div>
    </>
  )
}
