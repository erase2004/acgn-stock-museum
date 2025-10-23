import dayjs from 'dayjs'

export function isArenaEnded(endTime: Date, roundEnd: Date) {
  // 最後一場大賽的計算時間比賽事結束時間還晚一點時間，所以給予 30 分鐘的緩衝
  return dayjs(endTime).subtract(30, 'minutes').isBefore(dayjs(roundEnd))
}

export function isArenaJoinEnded(joinEndTime: Date, roundEnd: Date) {
  return joinEndTime.getTime() < roundEnd.getTime()
}
