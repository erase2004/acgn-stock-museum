import UserLink from '@/components/common/preact/UserLink'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import { z } from 'astro/zod'
import { escape, isEmpty } from 'lodash-es'
import { schema } from '@/services/dbLog'
import { roleDisplayName, SpecialUser } from '@/services/dbUsers'
import { currencyFormat, interleave } from '@/utils/helpers'
import { stoneDisplayName } from '@/utils/stone'
import { getViolationCaseUrl } from '@/libs/routes'
import { formatDateTimeText } from '@/libs/timeFormat'

type Log = z.infer<typeof schema>
type Props = Log & { round: string }

export default function DisplayLog({ round, logType, userId, companyId, data, createdAt }: Props) {
  const companyJsx = companyId ? <CompanyLink round={round} companyId={companyId} /> : null
  const usersJsx = Array.isArray(userId)
    ? userId.map((id) => <UserLink round={round} userId={id} />)
    : []

  let contentJsx: preact.JSX.Element | string

  switch (logType) {
    case '驗證通過': {
      contentJsx = `帳號驗證通過，領取起始資金$${currencyFormat(data.money)}！`
      break
    }

    case '登入紀錄': {
      contentJsx = (
        <>
          {usersJsx[0]}從{data.ipAddr}登入了系統！
        </>
      )
      break
    }

    case '購買得石': {
      contentJsx = (
        <>
          【購買得石】{usersJsx[0]}花費${currencyFormat(data.cost)}購買了{data.amount}個
          {stoneDisplayName(data.stoneType)}！
        </>
      )
      break
    }

    case '聊天發言': {
      contentJsx = (
        <>
          {usersJsx[0]}說道：「{escape(data.message)}」
        </>
      )
      break
    }

    case '發薪紀錄': {
      if (userId && userId[0] === '!all') {
        contentJsx = `【發薪紀錄】系統向所有已驗證通過且未就業的使用者發給了$${currencyFormat(data.salary)}的薪水！`
      } else {
        contentJsx = (
          <>
            【發薪紀錄】「{companyJsx}」公司向{interleave(usersJsx, '、')}發給了$
            {currencyFormat(data.salary)}的薪水！
          </>
        )
      }
      break
    }

    case '公司復活': {
      let extraInfo: preact.JSX.Element | string
      if (data.manager === SpecialUser.NONE) {
        extraInfo = '但無人就任公司經理。'
      } else {
        extraInfo = (
          <>
            <UserLink round={round} userId={data.manager} />
            將就任公司經理。
          </>
        )
      }

      contentJsx = (
        <>
          【公司復活】由於{interleave(usersJsx, '、')}等人的投資， 位於保管庫中的「{companyJsx}
          」公司成功復活並重新進入新創計劃，
          {extraInfo}
        </>
      )
      break
    }

    case '創立公司': {
      const companyDisplay = companyId ? companyJsx : escape(data.companyName)
      contentJsx = (
        <>
          【創立公司】{usersJsx[0]}發起了「{companyDisplay}」的新公司創立計劃，誠意邀請有意者投資！
        </>
      )
      break
    }

    case '參與投資': {
      const companyDisplay = companyId ? companyJsx : escape(data.companyName)
      contentJsx = (
        <>
          【參與投資】{usersJsx[0]}向「{companyDisplay}」公司投資了${currencyFormat(data.fund)}！
        </>
      )
      break
    }

    case '創立失敗': {
      contentJsx = (
        <>
          【創立失敗】{interleave(usersJsx, '、')}等人投資的「{escape(data.companyName)}
          公司創立計劃」由於投資人數不足失敗了，投資金額將全數返回！
        </>
      )
      break
    }

    case '創立退款': {
      const companyDisplay = companyId ? companyJsx : escape(data.companyName)
      contentJsx = (
        <>
          【創立退款】{usersJsx[0]}從「{companyDisplay}公司創立計劃」收回了$
          {currencyFormat(data.refund)}的投資退款！
        </>
      )
      break
    }

    case '創立成功': {
      contentJsx = (
        <>
          【創立成功】{interleave(usersJsx, '、')}等人投資的「{companyJsx}
          公司創立計劃」成功了，該公司正式上市，初始股價為${currencyFormat(data.price)}！
        </>
      )
      break
    }

    case '創立得股': {
      contentJsx = (
        <>
          【創立得股】對「{companyJsx}公司創立計劃」的${currencyFormat(data.fund)}投資為
          {usersJsx[0]}帶來了{data.stocks}數量的公司股票！
        </>
      )
      break
    }

    case '購買下單': {
      contentJsx = placeOrderInfo('買入', data, usersJsx, companyJsx)
      break
    }

    case '販賣下單': {
      contentJsx = placeOrderInfo('賣出', data, usersJsx, companyJsx)
      break
    }

    case '取消下單': {
      contentJsx = (
        <>
          【取消下單】{usersJsx[0]}取消了{orderInfo(data, companyJsx)}！
        </>
      )
      break
    }

    case '系統撤單': {
      contentJsx = (
        <>
          【系統撤單】因商業季度結束，系統自動取消了{usersJsx[0]}
          {orderInfo(data, companyJsx)}！
        </>
      )
      break
    }

    case '訂單完成': {
      if (userId && userId[0] === SpecialUser.SYSTEM) {
        contentJsx = (
          <>
            【訂單完成】{companyJsx}以每股${currencyFormat(data.price)}的單價釋出{data.amount}
            數量股票的訂單已經全數交易完畢！
          </>
        )
      } else {
        contentJsx = (
          <>
            【訂單完成】{usersJsx[0]}
            {orderInfo(data, companyJsx)}已經全數交易完畢！
          </>
        )
      }
      break
    }

    case '公司釋股': {
      contentJsx = (
        <>
          【公司釋股】「{companyJsx}」公司以${currencyFormat(data.price)}的價格釋出了{data.amount}
          數量的股票到市場上！
        </>
      )
      break
    }

    case '交易紀錄': {
      const buyer = usersJsx[0]
      const seller = Array.isArray(userId) && userId[1] ? usersJsx[1] : <>「{companyJsx}」公司</>

      contentJsx = (
        <>
          【交易紀錄】{buyer}以${currencyFormat(data.price)}的單價向{seller}購買了{data.amount}
          數量的「{companyJsx}」公司股票！
        </>
      )
      break
    }

    case '辭職紀錄': {
      contentJsx = (
        <>
          【辭職紀錄】{usersJsx[0]}辭去了「{companyJsx}」公司的經理人職務！
        </>
      )
      break
    }

    case '撤職紀錄': {
      contentJsx = (
        <>
          【撤職紀錄】{usersJsx[0]}以「{escape(data.reason)}」的理由撤除{usersJsx[1]}於「
          {companyJsx}」公司的經理人職務與候選資格！
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '參選紀錄': {
      contentJsx = (
        <>
          【參選紀錄】{usersJsx[0]}開始競選「{companyJsx}」公司的經理人職務！
        </>
      )
      break
    }

    case '支持紀錄': {
      contentJsx = (
        <>
          【支持紀錄】{usersJsx[0]}開始支持{usersJsx[1]}擔任「{companyJsx}」公司的經理人。
        </>
      )
      break
    }

    case '就任經理': {
      let extraInfo: preact.JSX.Element = <></>

      if (Array.isArray(userId)) {
        if (!userId[1] || userId[1] === SpecialUser.NONE) {
          extraInfo = <>成為了「{companyJsx}」公司的經理人。</>
        } else if (userId[0] === userId[1]) {
          extraInfo = <>繼續擔任「{companyJsx}」公司的經理人職務。</>
        } else {
          extraInfo = (
            <>
              取代了{usersJsx[1]}成為了「{companyJsx}」公司的經理人。
            </>
          )
        }
      }

      contentJsx = (
        <>
          【就任經理】{usersJsx[0]}在{data.seasonName}商業季度以{data.stocks || 0}
          數量的支持股份勝出，{extraInfo}
        </>
      )
      break
    }

    case '經理管理': {
      contentJsx = (
        <>
          【經理管理】{usersJsx[0]}修改了「{companyJsx}」公司的資訊！
        </>
      )
      break
    }

    case '推薦產品': {
      contentJsx = (
        <>
          【推薦產品】{usersJsx[0]}向「{companyJsx}」公司的產品「
          <ProductLink productId={data.productId} />
          」投了一張推薦票！
        </>
      )
      break
    }

    case '購買產品': {
      const { voucherCost, moneyCost } = data
      const costMessageList = []

      if (voucherCost > 0) {
        costMessageList.push(`消費券$${currencyFormat(voucherCost)}`)
      }
      if (moneyCost > 0) {
        costMessageList.push(`現金$${currencyFormat(moneyCost)}`)
      }

      contentJsx = (
        <>
          【購買產品】{usersJsx[0]}花費{costMessageList.join('以及')}買了「{companyJsx}
          」公司的產品「
          <ProductLink productId={data.productId} />
          」共{data.amount}個，使該公司獲得了${currencyFormat(data.profit)}的營利額！
        </>
      )
      break
    }

    case '員工營利': {
      contentJsx = (
        <>
          【員工營利】{interleave(usersJsx, '、')}等人努力工作，使「{companyJsx}」公司獲得了$
          {currencyFormat(data.profit)}的營利額！
        </>
      )
      break
    }

    case '公司營利': {
      contentJsx = (
        <>
          【公司營利】「{companyJsx}」公司在本商業季度一共獲利${currencyFormat(data.profit)}！
        </>
      )
      break
    }

    case '營利分紅': {
      if (data.bonusType === 'capitalIncrease') {
        // 資本額注入的 special case
        contentJsx = (
          <>
            【營利分紅】「{companyJsx}」公司的資本額增加了${currencyFormat(data.amount)}！
          </>
        )
        break
      }

      const bonusTypeDisplayNameMap = {
        managerBonus: '經理分紅',
        employeeBonus: '員工分紅',
        employeeProductVotingReward: '員工投票獎金',
        directorBonus: '股東分紅',
      }

      const bonusType =
        // @ts-expect-error: bonusType should be valid key
        bonusTypeDisplayNameMap[data.bonusType] || '分紅'

      contentJsx = (
        <>
          【營利分紅】{usersJsx[0]}得到了「{companyJsx}」公司的{bonusType}$
          {currencyFormat(data.amount)}！
        </>
      )
      break
    }

    case '推薦回饋': {
      contentJsx = (
        <>
          【推薦回饋】系統向{usersJsx[0]}發給了產品投票回饋金${currencyFormat(data.reward)}！
        </>
      )
      break
    }

    case '消費回饋': {
      contentJsx = (
        <>
          【消費回饋】{usersJsx[0]}得到了「{companyJsx}」公司的產品消費回饋金$
          {currencyFormat(data.rebate)}！
        </>
      )
      break
    }

    case '季度賦稅': {
      contentJsx = (
        <>
          【季度賦稅】{usersJsx[0]}在此次商業季度中產生了${currencyFormat(data.stockTax)}
          的股票資產稅、${currencyFormat(data.moneyTax)}的現金資產稅與$
          {currencyFormat(data.zombieTax)}的殭屍稅！
        </>
      )
      break
    }

    case '繳納稅金': {
      contentJsx = (
        <>
          【繳納稅金】{usersJsx[0]}向系統繳納了${currencyFormat(data.paid)}的稅金！
        </>
      )
      break
    }

    case '繳稅逾期': {
      contentJsx = (
        <>
          【繳稅逾期】{usersJsx[0]}由於繳稅逾期，被系統追加了${currencyFormat(data.fine)}的稅金！
        </>
      )
      break
    }

    case '繳稅沒金': {
      contentJsx = (
        <>
          【繳稅沒收】{usersJsx[0]}由於繳稅逾期，被系統沒收了${currencyFormat(data.money)}的現金！
        </>
      )
      break
    }

    case '繳稅撤單': {
      contentJsx = <>【繳稅沒收】{usersJsx[0]}由於繳稅逾期，被系統撤銷了所有買入訂單！</>
      break
    }

    case '繳稅沒收': {
      contentJsx = (
        <>
          【繳稅沒收】{usersJsx[0]}由於繳稅逾期，被系統以參考價格${currencyFormat(data.price)}
          沒收了「{companyJsx}」公司的股份數量{data.stocks}！
        </>
      )
      break
    }

    case '廣告宣傳': {
      contentJsx = (
        <>
          【廣告宣傳】{usersJsx[0]}以${currencyFormat(data.cost)}的價格發布了一則廣告：「
          {escape(data.message)}」！
        </>
      )
      break
    }

    case '廣告追加': {
      // NOTE: users[1] 存在與否是第三賽季的過渡，以後將可省略
      contentJsx = (
        <>
          【廣告競價】{usersJsx[0]}追加了${currencyFormat(data.cost)}的廣告費用在$
          {usersJsx[1] ? <>{usersJsx[1]}發佈的</> : ''}廣告：「{escape(data.message)}」上！
        </>
      )
      break
    }

    case '舉報違規': {
      let extraInfo: preact.JSX.Element = <></>

      if (Array.isArray(userId)) {
        if (companyId) {
          if (userId[1]) {
            extraInfo = (
              <>
                「{companyJsx}」公司及其經理人{usersJsx[1]}的違例事項。
              </>
            )
          } else {
            extraInfo = <>「{companyJsx}」公司的違例事項。</>
          }
        } else if (userId[1]) {
          if (data.ipAddr) {
            // FIXME: legacy condition
            extraInfo = (
              <>
                {usersJsx[1]}({data.ipAddr})的違規行為。
              </>
            )
          } else {
            extraInfo = <>{usersJsx[1]}的違規行為。</>
          }
        }
      }

      contentJsx = (
        <>
          【舉報違規】{usersJsx[0]}以「{escape(data.reason)}」的理由向金融管理會舉報{extraInfo}
        </>
      )
      break
    }

    case '金管通告': {
      let targetJsx: preact.JSX.Element = <></>
      const [sourceUser, ...targetUsers] = usersJsx

      if (companyId) {
        if (targetUsers.length > 0) {
          targetJsx = (
            <>
              向「{companyJsx}」公司及其經理人{targetUsers[0]}
            </>
          )
        } else {
          targetJsx = <>向「{companyJsx}」公司</>
        }
      } else if (targetUsers.length > 0) {
        targetJsx = <>向{interleave(targetUsers, '、')}</>
      }

      contentJsx = (
        <>
          【金管通告】{sourceUser}以金管會的名義{targetJsx}通告：「{escape(data.message)}」。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '通報金管': {
      contentJsx = (
        <>
          【通報金管】{usersJsx[0]}向金管會通報：「{escape(data.message)}」。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '禁止舉報': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'stop', '舉報違規', data, usersJsx)
      break
    }

    case '禁止下單': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'stop', '投資下單', data, usersJsx)
      break
    }

    case '禁止聊天': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'stop', '聊天發言', data, usersJsx)
      break
    }

    case '禁止廣告': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'stop', '廣告宣傳', data, usersJsx)
      break
    }

    case '禁止簡介': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'stop', '編輯個人簡介', data, usersJsx)
      break
    }

    case '禁任經理': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'stop', '擔任經理人', data, usersJsx)
      break
    }

    case '解除舉報': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'resume', '舉報違規', data, usersJsx)
      break
    }

    case '解除下單': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'resume', '投資下單', data, usersJsx)
      break
    }

    case '解除聊天': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'resume', '聊天發言', data, usersJsx)
      break
    }

    case '解除廣告': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'resume', '廣告宣傳', data, usersJsx)
      break
    }

    case '解除簡介': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'resume', '編輯個人簡介', data, usersJsx)
      break
    }

    case '解除禁任': {
      contentJsx = stopOrResumePrvilegeInfo(round, 'resume', '擔任經理人', data, usersJsx)
      break
    }

    case '課以罰款': {
      const target = usersJsx[1] || <>「{companyJsx}」公司</>
      contentJsx = (
        <>
          【課以罰款】{usersJsx[0]}以「{escape(data.reason)}」的理由向{target}課以總數為$
          {currencyFormat(data.fine)}的罰金。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '退還罰款': {
      const target = usersJsx[1] || <>「{companyJsx}」公司</>
      contentJsx = (
        <>
          【退還罰款】{usersJsx[0]}以「{escape(data.reason)}」的理由向{target}退還總數為$
          {currencyFormat(data.fine)}的罰金。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '金管撤單': {
      contentJsx = (
        <>
          【金管撤單】{usersJsx[0]}以「{escape(data.reason)}」的理由取消了{usersJsx[1]}
          {orderInfo(data, companyJsx)}！{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '沒收股份': {
      contentJsx = (
        <>
          【沒收股份】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}持有的「
          {companyJsx}」公司股份數量{data.stocks}給沒收了。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '清除簡介': {
      contentJsx = (
        <>
          【清除簡介】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}
          的個人簡介給清空了。{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '查封關停': {
      const companyDisplay = companyId ? companyJsx : '???' // FIXME 保管庫更新期間資料錯誤的暫時處置
      contentJsx = (
        <>
          【查封關停】{usersJsx[0]}以「{escape(data.reason)}」的理由查封關停了「{companyDisplay}
          」公司。{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '解除查封': {
      contentJsx = (
        <>
          【解除查封】{usersJsx[0]}以「{escape(data.reason)}」的理由解除了「{companyJsx}
          」公司的查封關停狀態。{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '違規標記': {
      contentJsx = (
        <>
          【違規標記】{usersJsx[0]}以「{escape(data.reason)}」的理由將「{companyJsx}
          」公司標記為違規！{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '違規解標': {
      contentJsx = (
        <>
          【違規標記】{usersJsx[0]}移除了「{companyJsx}」公司的違規標記！
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '公司更名': {
      contentJsx = (
        <>
          【公司更名】{usersJsx[0]}將「{companyJsx}」公司的名稱由「{escape(data.oldCompanyName)}
          」改為「{escape(data.newCompanyName)}」。
          {data.violationCaseId ? (
            <>（案件 {violationCaseLink(round, data.violationCaseId)}）</>
          ) : (
            ''
          )}
        </>
      )
      break
    }

    case '產品下架': {
      let extraInfo: preact.JSX.Element = <></>
      if (data.profit) {
        extraInfo = (
          <>
            ，並追回了因該產品所產生的營利${currencyFormat(data.profit)}。
            {displayViolationCaseOrNot(round, data.violationCaseId)}
          </>
        )
      } else {
        extraInfo = <>。{displayViolationCaseOrNot(round, data.violationCaseId)}</>
      }

      contentJsx = (
        <>
          【產品下架】{usersJsx[0]}以「{escape(data.reason)}」的理由將「{companyJsx}」公司的產品「
          {escape(data.productName)}」給下架了{extraInfo}
        </>
      )
      break
    }

    case '產品修正': {
      const diffString = Object.entries(data.diff)
        // @ts-expect-error: before, after is unknown
        .map(([key, { before, after }]) => {
          return `${productInfoKeyToString(key)}從${before ? `「${before}」` : '無'}改為${after ? `「${after}」` : '無'}`
        })
        .join('、')

      contentJsx = (
        <>
          【產品修正】{usersJsx[0]}以金管會的名義修改了「{companyJsx}」公司的產品「
          <ProductLink productId={data.productId} />
          」，{isEmpty(data.diff) ? '但並未造成任何改變' : `將${diffString}`}。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '撤銷廣告': {
      contentJsx = (
        <>
          【撤銷廣告】{usersJsx[0]}將{usersJsx[1]}發布的廣告「{escape(data.message)}」給撤銷了。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
      break
    }

    case '亂鬥報名': {
      contentJsx = (
        <>
          【最萌亂鬥】{usersJsx[0]}替「{companyJsx}」公司報名參加了這一屆的最萌亂鬥大賽！
        </>
      )
      break
    }

    case '亂鬥失格': {
      contentJsx = (
        <>
          【最萌亂鬥】「{companyJsx}」公司因為總投資金額未達標，失去了這一屆最萌亂鬥大賽的參賽資格！
        </>
      )
      break
    }

    case '亂鬥退款': {
      contentJsx = (
        <>
          【最萌亂鬥】{usersJsx[0]}從「{companyJsx}」公司收回了${data.refund}的投資退款！
        </>
      )
      break
    }

    case '亂鬥加強': {
      contentJsx = (
        <>
          【最萌亂鬥】{usersJsx[0]}對這一屆最萌亂鬥大賽參賽者「{companyJsx}」公司的{data.attrName}
          能力值投資了${currencyFormat(data.money)}的金錢！
        </>
      )
      break
    }

    case '亂鬥營利': {
      contentJsx = (
        <>
          【最萌亂鬥】「{companyJsx}」公司在這一屆最萌亂鬥大賽中表現出眾，獲得了$
          {currencyFormat(data.reward)}的營利金額！
        </>
      )
      break
    }

    case '礦機營利': {
      contentJsx = (
        <>
          【礦機營利】「{companyJsx}」公司的挖礦機集結眾人之力努力運轉，使其獲得了$
          {currencyFormat(data.profit)}的營利額！
        </>
      )
      break
    }

    case '身份指派': {
      contentJsx = (
        <>
          【身份指派】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}指派了
          {roleDisplayName(data.role)}的身份！
        </>
      )
      break
    }

    case '身份解除': {
      contentJsx = (
        <>
          【身份解除】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}解除了
          {roleDisplayName(data.role)}的身份！
        </>
      )
      break
    }

    case '營運送禮': {
      let targetJsx: preact.JSX.Element | string | (preact.JSX.Element | string)[] = <></>
      let itemJsx: string = ''

      switch (data.userType) {
        case 'all':
          targetJsx = '所有玩家'
          break
        case 'active':
          targetJsx = '所有活躍玩家'
          break
        case 'recentlyLoggedIn':
          targetJsx = `最近 ${data.days} 日內有登入的玩家`
          break
        case 'specified':
          targetJsx = interleave(usersJsx.slice(1), '、')
          break
      }

      switch (data.giftType) {
        case 'saintStone':
          itemJsx = ` ${data.amount} 個聖晶石`
          break
        case 'rainbowStone':
          itemJsx = ` ${data.amount} 個彩紅石`
          break
        case 'rainbowStoneFragment':
          itemJsx = ` ${data.amount} 個彩虹石碎片`
          break
        case 'questStone':
          itemJsx = ` ${data.amount} 個任務石`
          break
        case 'money':
          itemJsx = ` $${currencyFormat(data.amount)} 的現金`
          break
        case 'voucher':
          itemJsx = ` ${data.amount} 張消費券`
          break
        case 'voteTicket':
          itemJsx = ` ${data.amount} 張推薦票`
          break
      }

      contentJsx = (
        <>
          【營運送禮】{usersJsx[0]}以「{escape(data.reason)}」的理由發給了{targetJsx}
          {itemJsx}！
        </>
      )
      break
    }
    default: {
      // It should be unreachable
      const _unhandledLogType: never = logType
      contentJsx = <></>
      break
    }
  }

  return (
    <>
      <time class="mr-2 text-primary">({formatDateTimeText(createdAt)})</time>
      {contentJsx}
    </>
  )
}

function placeOrderInfo(
  orderType: '買入' | '賣出',
  { price, amount }: any,
  usersJsx: preact.JSX.Element[],
  companyJsx: preact.JSX.Element | null,
) {
  const title = orderType === '買入' ? '購買' : '販賣'
  return (
    <>
      【{title}下單】{usersJsx[0]}想要用每股${currencyFormat(price)}的單價{orderType}
      {amount}數量的「{companyJsx}」公司股票！
    </>
  )
}

function orderInfo({ price, orderType, amount }: any, companyJsx: preact.JSX.Element | null) {
  return (
    <>
      以每股${currencyFormat(price)}的單價{orderType}
      {amount}數量的「{companyJsx}」公司股票的訂單
    </>
  )
}

function violationCaseLink(round: string, violationCaseId: string) {
  const url = getViolationCaseUrl(round, violationCaseId)

  return (
    <>
      <a href={url}>{violationCaseId}</a>
    </>
  )
}

function displayViolationCaseOrNot(round: string, violationCaseId?: string) {
  return violationCaseId ? <>（案件 {violationCaseLink(round, violationCaseId)}）</> : ''
}

function stopOrResumePrvilegeInfo(
  round: string,
  type: 'stop' | 'resume',
  privilege: string,
  { reason, violationCaseId }: any,
  usersJsx: preact.JSX.Element[],
) {
  if (type === 'stop') {
    return (
      <>
        【玩家停權】{usersJsx[0]}以「{escape(reason)}」的理由禁止{usersJsx[1]}今後的所有{privilege}
        行為。{displayViolationCaseOrNot(round, violationCaseId)}
      </>
    )
  }
  return (
    <>
      【玩家復權】{usersJsx[0]}以「{escape(reason)}」的理由中止了{usersJsx[1]}的{privilege}禁令。
      {displayViolationCaseOrNot(round, violationCaseId)}
    </>
  )
}

function productInfoKeyToString(key: string) {
  switch (key) {
    case 'productName':
      return '名稱'
    case 'type':
      return '分類'
    case 'rating':
      return '分級'
    case 'url':
      return '網址'
    case 'description':
      return '描述'
    default:
      return `未知欄位(${key})`
  }
}
