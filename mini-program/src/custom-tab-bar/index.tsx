import { CoverImage, CoverView } from '@tarojs/components'
import Taro from '@tarojs/taro'
// import clx from 'classnames'
import config from '@/app.config'
import { useEffect, useState } from 'react'
import './index.scss'

const isEqualPath = (a: string, b: string) =>
  (a || '').replace(/^\//, '') === (b || '').replace(/^\//, '')

const switchTo = (path) => () => {
  Taro.switchTab({
    url: '/' + path,
  })
}

const color = '#000000';
const selectedColor = '#DC143C';

const CustomTabbar = () => {

  const [path, setPath] = useState(Taro.getCurrentInstance().router!.path)
  useEffect(() => {
    wx.onAppRoute(function (res) {
      setPath(res.path)
    })
  }, [])

  return (
    <CoverView className='tab-bar'>
      <CoverView className='tab-bar-border' />
      {config.tabBar.list.map((item, index) => {
        const isSelected = isEqualPath(path, item.pagePath)

        return (
          <CoverView
            className='tab-bar-item'
            key={index}
            onClick={switchTo(item.pagePath)}
          >
            <CoverImage
              src={isSelected ? "../" + item.selectedIconPath : "../" + item.iconPath}
            />
            <CoverView style={{ color: isSelected ? selectedColor : color }}>{item.text}</CoverView>
          </CoverView>
        )
      })}
    </CoverView>
  )
}

export default CustomTabbar
