import { z } from 'astro/zod'
import { logsWithCountSchema } from '@/services/dbLog'
import UserLink from '@/components/common/preact/UserLink'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import { currencyFormat, interleave, stoneDisplayName } from '@/utils/helpers'
import { escape, isEmpty } from 'lodash-es'
import { getPageUrl, PAGE } from '@/libs/routes'
import { roleDisplayName, SpecialUser } from '@/services/dbUsers'

type Props = z.infer<typeof logsWithCountSchema>[number]['data'][number] & {
  round: string
}

export default function DisplayLog({ round, logType, userId, companyId, data }: Props) {
  const companyJsx = companyId ? <CompanyLink round={round} companyId={companyId} /> : null
  const usersJsx = Array.isArray(userId)
    ? userId.map((id) => <UserLink round={round} userId={id} />)
    : []

  switch (logType) {
    case '驗證通過':
      return `帳號驗證通過，領取起始資金$${currencyFormat(data.money)}！`

    case '登入紀錄':
      return (
        <>
          {usersJsx[0]}從{data.ipAddr}登入了系統！
        </>
      )

    case '購買得石':
      return (
        <>
          【購買得石】{usersJsx[0]}花費${currencyFormat(data.cost)}購買了{data.amount}個
          {stoneDisplayName(data.stoneType)}！
        </>
      )

    case '聊天發言':
      return (
        <>
          {usersJsx[0]}說道：「{escape(data.message)}」
        </>
      )

    case '發薪紀錄': {
      if (userId && userId[0] === '!all') {
        return `【發薪紀錄】系統向所有已驗證通過且未就業的使用者發給了$${currencyFormat(data.salary)}的薪水！`
      }
      return (
        <>
          【發薪紀錄】「{companyJsx}」公司向{interleave(usersJsx, '、')}發給了$
          {currencyFormat(data.salary)}的薪水！
        </>
      )
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

      return (
        <>
          【公司復活】由於{interleave(usersJsx, '、')}等人的投資， 位於保管庫中的「{companyJsx}
          」公司成功復活並重新進入新創計劃，
          {extraInfo}
        </>
      )
    }

    case '創立公司': {
      const companyDisplay = companyId ? companyJsx : escape(data.companyName)
      return (
        <>
          【創立公司】{usersJsx[0]}發起了「{companyDisplay}」的新公司創立計劃，誠意邀請有意者投資！
        </>
      )
    }

    case '參與投資': {
      const companyDisplay = companyId ? companyJsx : escape(data.companyName)
      return (
        <>
          【參與投資】{usersJsx[0]}向「{companyDisplay}」公司投資了${currencyFormat(data.fund)}！
        </>
      )
    }

    case '創立失敗':
      return (
        <>
          【創立失敗】{interleave(usersJsx, '、')}等人投資的「{escape(data.companyName)}
          公司創立計劃」由於投資人數不足失敗了，投資金額將全數返回！
        </>
      )

    case '創立退款': {
      const companyDisplay = companyId ? companyJsx : escape(data.companyName)
      return (
        <>
          【創立退款】{usersJsx[0]}從「{companyDisplay}公司創立計劃」收回了$
          {currencyFormat(data.refund)}的投資退款！
        </>
      )
    }

    case '創立成功':
      return (
        <>
          【創立成功】{interleave(usersJsx, '、')}等人投資的「{companyJsx}
          公司創立計劃」成功了，該公司正式上市，初始股價為${currencyFormat(data.price)}！
        </>
      )

    case '創立得股':
      return (
        <>
          【創立得股】對「{companyJsx}公司創立計劃」的${currencyFormat(data.fund)}投資為
          {usersJsx[0]}帶來了{data.stocks}數量的公司股票！
        </>
      )

    case '購買下單':
      return placeOrderInfo('買入', data, usersJsx, companyJsx)

    case '販賣下單':
      return placeOrderInfo('賣出', data, usersJsx, companyJsx)

    case '取消下單':
      return (
        <>
          【取消下單】{usersJsx[0]}取消了{orderInfo(data, companyJsx)}！
        </>
      )

    case '系統撤單':
      return (
        <>
          【系統撤單】因商業季度結束，系統自動取消了{usersJsx[0]}
          {orderInfo(data, companyJsx)}！
        </>
      )

    case '訂單完成': {
      if (userId && userId[0] === SpecialUser.SYSTEM) {
        return (
          <>
            【訂單完成】{companyJsx}以每股${currencyFormat(data.price)}的單價釋出{data.amount}
            數量股票的訂單已經全數交易完畢！
          </>
        )
      } else {
        return (
          <>
            【訂單完成】{usersJsx[0]}
            {orderInfo(data, companyJsx)}已經全數交易完畢！
          </>
        )
      }
    }

    case '公司釋股':
      return (
        <>
          【公司釋股】「{companyJsx}」公司以${currencyFormat(data.price)}的價格釋出了{data.amount}
          數量的股票到市場上！
        </>
      )

    case '交易紀錄': {
      const buyer = usersJsx[0]
      const seller = Array.isArray(userId) && userId[1] ? usersJsx[1] : <>「{companyJsx}」公司</>

      return (
        <>
          【交易紀錄】{buyer}以${currencyFormat(data.price)}的單價向{seller}購買了{data.amount}
          數量的「{companyJsx}」公司股票！
        </>
      )
    }

    case '辭職紀錄':
      return (
        <>
          【辭職紀錄】{usersJsx[0]}辭去了「{companyJsx}」公司的經理人職務！
        </>
      )

    case '撤職紀錄':
      return (
        <>
          【撤職紀錄】{usersJsx[0]}以「{escape(data.reason)}」的理由撤除{usersJsx[1]}於「
          {companyJsx}」公司的經理人職務與候選資格！
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '參選紀錄':
      return (
        <>
          【參選紀錄】{usersJsx[0]}開始競選「{companyJsx}」公司的經理人職務！
        </>
      )

    case '支持紀錄':
      return (
        <>
          【支持紀錄】{usersJsx[0]}開始支持{usersJsx[1]}擔任「{companyJsx}」公司的經理人。
        </>
      )

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

      return (
        <>
          【就任經理】{usersJsx[0]}在{data.seasonName}商業季度以{data.stocks || 0}
          數量的支持股份勝出，{extraInfo}
        </>
      )
    }

    case '經理管理':
      return (
        <>
          【經理管理】{usersJsx[0]}修改了「{companyJsx}」公司的資訊！
        </>
      )

    case '推薦產品':
      return (
        <>
          【推薦產品】{usersJsx[0]}向「{companyJsx}」公司的產品「
          <ProductLink round={round} productId={data.productId} />
          」投了一張推薦票！
        </>
      )

    case '購買產品': {
      const { voucherCost, moneyCost } = data
      const costMessageList = []

      if (voucherCost > 0) {
        costMessageList.push(`消費券$${currencyFormat(voucherCost)}`)
      }
      if (moneyCost > 0) {
        costMessageList.push(`現金$${currencyFormat(moneyCost)}`)
      }

      return (
        <>
          【購買產品】{usersJsx[0]}花費{costMessageList.join('以及')}買了「{companyJsx}
          」公司的產品「
          <ProductLink round={round} productId={data.productId} />
          」共{data.amount}個，使該公司獲得了${currencyFormat(data.profit)}的營利額！
        </>
      )
    }

    case '員工營利':
      return (
        <>
          【員工營利】{interleave(usersJsx, '、')}等人努力工作，使「{companyJsx}」公司獲得了$
          {currencyFormat(data.profit)}的營利額！
        </>
      )

    case '公司營利':
      return (
        <>
          【公司營利】「{companyJsx}」公司在本商業季度一共獲利${currencyFormat(data.profit)}！
        </>
      )

    case '營利分紅': {
      if (data.bonusType === 'capitalIncrease') {
        // 資本額注入的 special case
        return (
          <>
            【營利分紅】「{companyJsx}」公司的資本額增加了${currencyFormat(data.amount)}！
          </>
        )
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

      return (
        <>
          【營利分紅】{usersJsx[0]}得到了「{companyJsx}」公司的{bonusType}$
          {currencyFormat(data.amount)}！
        </>
      )
    }

    case '推薦回饋':
      return (
        <>
          【推薦回饋】系統向{usersJsx[0]}發給了產品投票回饋金${currencyFormat(data.reward)}！
        </>
      )

    case '消費回饋':
      return (
        <>
          【消費回饋】{usersJsx[0]}得到了「{companyJsx}」公司的產品消費回饋金$
          {currencyFormat(data.rebate)}！
        </>
      )

    case '季度賦稅':
      return (
        <>
          【季度賦稅】{usersJsx[0]}在此次商業季度中產生了${currencyFormat(data.stockTax)}
          的股票資產稅、${currencyFormat(data.moneyTax)}的現金資產稅與$
          {currencyFormat(data.zombieTax)}的殭屍稅！
        </>
      )

    case '繳納稅金':
      return (
        <>
          【繳納稅金】{usersJsx[0]}向系統繳納了${currencyFormat(data.paid)}的稅金！
        </>
      )

    case '繳稅逾期':
      return (
        <>
          【繳稅逾期】{usersJsx[0]}由於繳稅逾期，被系統追加了${currencyFormat(data.fine)}的稅金！
        </>
      )

    case '繳稅沒金':
      return (
        <>
          【繳稅沒收】{usersJsx[0]}由於繳稅逾期，被系統沒收了${currencyFormat(data.money)}的現金！
        </>
      )

    case '繳稅撤單':
      return <>【繳稅沒收】{usersJsx[0]}由於繳稅逾期，被系統撤銷了所有買入訂單！</>

    case '繳稅沒收':
      return (
        <>
          【繳稅沒收】{usersJsx[0]}由於繳稅逾期，被系統以參考價格${currencyFormat(data.price)}
          沒收了「{companyJsx}」公司的股份數量{data.stocks}！
        </>
      )

    case '廣告宣傳':
      return (
        <>
          【廣告宣傳】{usersJsx[0]}以${currencyFormat(data.cost)}的價格發布了一則廣告：「
          {escape(data.message)}」！
        </>
      )

    case '廣告追加': {
      // NOTE: users[1] 存在與否是第三賽季的過渡，以後將可省略
      return (
        <>
          【廣告競價】{usersJsx[0]}追加了${currencyFormat(data.cost)}的廣告費用在$
          {usersJsx[1] ? <>{usersJsx[1]}發佈的</> : ''}廣告：「{escape(data.message)}」上！
        </>
      )
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

      return (
        <>
          【舉報違規】{usersJsx[0]}以「{escape(data.reason)}」的理由向金融管理會舉報{extraInfo}
        </>
      )
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

      return (
        <>
          【金管通告】{sourceUser}以金管會的名義{targetJsx}通告：「{escape(data.message)}」。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
    }

    case '通報金管':
      return (
        <>
          【通報金管】{usersJsx[0]}向金管會通報：「{escape(data.message)}」。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '禁止舉報':
      return stopOrResumePrvilegeInfo(round, 'stop', '舉報違規', data, usersJsx)

    case '禁止下單':
      return stopOrResumePrvilegeInfo(round, 'stop', '投資下單', data, usersJsx)

    case '禁止聊天':
      return stopOrResumePrvilegeInfo(round, 'stop', '聊天發言', data, usersJsx)

    case '禁止廣告':
      return stopOrResumePrvilegeInfo(round, 'stop', '廣告宣傳', data, usersJsx)

    case '禁止簡介':
      return stopOrResumePrvilegeInfo(round, 'stop', '編輯個人簡介', data, usersJsx)

    case '禁任經理':
      return stopOrResumePrvilegeInfo(round, 'stop', '擔任經理人', data, usersJsx)

    case '解除舉報':
      return stopOrResumePrvilegeInfo(round, 'resume', '舉報違規', data, usersJsx)

    case '解除下單':
      return stopOrResumePrvilegeInfo(round, 'resume', '投資下單', data, usersJsx)

    case '解除聊天':
      return stopOrResumePrvilegeInfo(round, 'resume', '聊天發言', data, usersJsx)

    case '解除廣告':
      return stopOrResumePrvilegeInfo(round, 'resume', '廣告宣傳', data, usersJsx)

    case '解除簡介':
      return stopOrResumePrvilegeInfo(round, 'resume', '編輯個人簡介', data, usersJsx)

    case '解除禁任':
      return stopOrResumePrvilegeInfo(round, 'resume', '擔任經理人', data, usersJsx)

    case '課以罰款': {
      const target = usersJsx[1] || <>「{companyJsx}」公司</>
      return (
        <>
          【課以罰款】{usersJsx[0]}以「{escape(data.reason)}」的理由向{target}課以總數為$
          {currencyFormat(data.fine)}的罰金。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
    }

    case '退還罰款': {
      const target = usersJsx[1] || <>「{companyJsx}」公司</>
      return (
        <>
          【退還罰款】{usersJsx[0]}以「{escape(data.reason)}」的理由向{target}退還總數為$
          {currencyFormat(data.fine)}的罰金。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
    }

    case '金管撤單':
      return (
        <>
          【金管撤單】{usersJsx[0]}以「{escape(data.reason)}」的理由取消了{usersJsx[1]}
          {orderInfo(data, companyJsx)}！{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '沒收股份':
      return (
        <>
          【沒收股份】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}持有的「
          {companyJsx}」公司股份數量{data.stocks}給沒收了。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '清除簡介':
      return (
        <>
          【清除簡介】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}
          的個人簡介給清空了。{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '查封關停': {
      const companyDisplay = companyId ? companyJsx : '???' // FIXME 保管庫更新期間資料錯誤的暫時處置
      return (
        <>
          【查封關停】{usersJsx[0]}以「{escape(data.reason)}」的理由查封關停了「{companyDisplay}
          」公司。{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
    }

    case '解除查封':
      return (
        <>
          【解除查封】{usersJsx[0]}以「{escape(data.reason)}」的理由解除了「{companyJsx}
          」公司的查封關停狀態。{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '違規標記':
      return (
        <>
          【違規標記】{usersJsx[0]}以「{escape(data.reason)}」的理由將「{companyJsx}
          」公司標記為違規！{displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '違規解標':
      return (
        <>
          【違規標記】{usersJsx[0]}移除了「{companyJsx}」公司的違規標記！
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '公司更名':
      return (
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

      return (
        <>
          【產品下架】{usersJsx[0]}以「{escape(data.reason)}」的理由將「{companyJsx}」公司的產品「
          {escape(data.productName)}」給下架了{extraInfo}
        </>
      )
    }

    case '產品修正': {
      const diffString = Object.entries(data.diff)
        // @ts-expect-error: before, after is unknown
        .map(([key, { before, after }]) => {
          return `${productInfoKeyToString(key)}從${before ? `「${before}」` : '無'}改為${after ? `「${after}」` : '無'}`
        })
        .join('、')

      return (
        <>
          【產品修正】{usersJsx[0]}以金管會的名義修改了「{companyJsx}」公司的產品「
          <ProductLink round={round} productId={data.productId} />
          」，{isEmpty(data.diff) ? '但並未造成任何改變' : `將${diffString}`}。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )
    }

    case '撤銷廣告':
      return (
        <>
          【撤銷廣告】{usersJsx[0]}將{usersJsx[1]}發布的廣告「{escape(data.message)}」給撤銷了。
          {displayViolationCaseOrNot(round, data.violationCaseId)}
        </>
      )

    case '亂鬥報名':
      return (
        <>
          【最萌亂鬥】{usersJsx[0]}替「{companyJsx}」公司報名參加了這一屆的最萌亂鬥大賽！
        </>
      )

    case '亂鬥失格':
      return (
        <>
          【最萌亂鬥】「{companyJsx}」公司因為總投資金額未達標，失去了這一屆最萌亂鬥大賽的參賽資格！
        </>
      )

    case '亂鬥退款':
      return (
        <>
          【最萌亂鬥】{usersJsx[0]}從「{companyJsx}」公司收回了${data.refund}的投資退款！
        </>
      )

    case '亂鬥加強':
      return (
        <>
          【最萌亂鬥】{usersJsx[0]}對這一屆最萌亂鬥大賽參賽者「{companyJsx}」公司的{data.attrName}
          能力值投資了${currencyFormat(data.money)}的金錢！
        </>
      )

    case '亂鬥營利':
      return (
        <>
          【最萌亂鬥】「{companyJsx}」公司在這一屆最萌亂鬥大賽中表現出眾，獲得了$
          {currencyFormat(data.reward)}的營利金額！
        </>
      )

    case '礦機營利':
      return (
        <>
          【礦機營利】「{companyJsx}」公司的挖礦機集結眾人之力努力運轉，使其獲得了$
          {currencyFormat(data.profit)}的營利額！
        </>
      )

    case '身份指派':
      return (
        <>
          【身份指派】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}指派了
          {roleDisplayName(data.role)}的身份！
        </>
      )

    case '身份解除':
      return (
        <>
          【身份解除】{usersJsx[0]}以「{escape(data.reason)}」的理由將{usersJsx[1]}解除了
          {roleDisplayName(data.role)}的身份！
        </>
      )

    case '營運送禮': {
      let targetJsx: preact.JSX.Element | string = <></>
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
          // @ts-expect-error: interleave result type is compatible
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

      return (
        <>
          【營運送禮】{usersJsx[0]}以「{escape(data.reason)}」的理由發給了{targetJsx}
          {itemJsx}！
        </>
      )
    }
    default: {
      // It should be unreachable
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unhandledLogType: never = logType
    }
  }
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
  const url = getPageUrl({
    round,
    pageName: PAGE.VIOLATION_CASE_DETAIL,
    params: violationCaseId,
  })
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
