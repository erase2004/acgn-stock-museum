import type { Data } from '@/components/index/types'

const round = 'round34'
const baseUrl = `/${round}/company/detail`

const data: Data[] = [
  {
    name: '100',
    ext: 'mp4',
    companyName: '黑貓(五更琉璃)',
    width: 300,
    height: 300,
    color: '#e3d9dd',
    url: `${baseUrl}/bG2Ejf96PneGJcMei`,
    isVideo: true,
  },
  {
    name: '101',
    ext: 'jpeg',
    companyName: '星街彗星',
    width: 1456,
    height: 2048,
    color: '#a7b0be',
    url: `${baseUrl}/gwrDQBgBvMGncnqJF`,
  },
  {
    name: '102',
    ext: 'png',
    companyName: '秋月(艦これ)',
    width: 371,
    height: 1100,
    color: '#4b433e',
    url: `${baseUrl}/D2iamqXtBNovLzSuE`,
  },
]

export default data
