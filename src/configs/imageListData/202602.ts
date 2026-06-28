import type { Data } from '@/components/index/types'

const round = 'round35'
const baseUrl = `/${round}/company/detail`

const data: Data[] = [
  {
    name: '103',
    ext: 'png',
    companyName: '篠澤廣',
    width: 700,
    height: 700,
    color: '#959c9f',
    url: `${baseUrl}/RLYs3fE8ooJqE6BKH`,
  },
  {
    name: '104',
    ext: 'jpg',
    companyName: '飛龍(艦これ)',
    width: 1500,
    height: 1933,
    color: '#d2d2c6',
    url: `${baseUrl}/2gAknyDBWKR8ZQbWe`,
  },
  {
    name: '105',
    ext: 'mp4',
    companyName: '黑貓(五更琉璃)',
    width: 300,
    height: 300,
    color: '#e3d9dd',
    url: `${baseUrl}/bG2Ejf96PneGJcMei`,
    isVideo: true,
  },
]

export default data
