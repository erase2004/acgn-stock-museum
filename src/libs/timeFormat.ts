import dayjs from 'dayjs'

export const FULL_DATETIME_FORMAT = 'YYYY/MM/DD HH:mm:ssZ'

export function formatDateTimeText(date?: dayjs.ConfigType) {
  if (!dayjs(date).isValid()) {
    return '????/??/?? ??:??:??±??:??'
  }

  return dayjs(date).format(FULL_DATETIME_FORMAT)
}
