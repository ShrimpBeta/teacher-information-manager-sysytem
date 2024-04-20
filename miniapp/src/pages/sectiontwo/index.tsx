import { PropsWithChildren, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { Tabs } from '@nutui/nutui-react-taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import Taro from '@tarojs/taro'
import { JWT } from '@/auth/jwt'

import OverviewMonograph from '@/components/overviewmonograph'
import OverviewPaper from '@/components/overviewpaper'
import OverviewSciResearch from '@/components/overviewscisearch'

import './index.scss'

const Sectiontwo = (props: PropsWithChildren) => {
  const token = useSelector((state: RootState) => state.userData.token);

  useEffect(() => {
    if (token === '') {
      // 未登录
      Taro.navigateTo({ url: '/pages/signin/index' });
    } else {
      // token过期
      if (JWT.getTokenExpiration(token)) {
        Taro.navigateTo({ url: '/pages/signin/index' });
      }
    }
  }, [token]);

  useDidShow(() => {
    // 防止返回可访问
    if (token === '') {
      // 未登录
      Taro.navigateTo({ url: '/pages/signin/index' });
    } else {
      // token过期
      if (JWT.getTokenExpiration(token)) {
        Taro.navigateTo({ url: '/pages/signin/index' });
      }
    }
  });

  useDidHide(() => { })

  const [tabvalue, setTabvalue] = useState<string | number>('0')

  return (
    <View className='sectiontwo'>
      <Tabs
        value={tabvalue}
        onChange={(value) => {
          setTabvalue(value)
        }}
        activeType="button">
        <Tabs.TabPane title="专著管理"><OverviewMonograph /> </Tabs.TabPane>
        <Tabs.TabPane title="论文管理"> <OverviewPaper /> </Tabs.TabPane>
        <Tabs.TabPane title="科研项目"> <OverviewSciResearch /> </Tabs.TabPane>
      </Tabs>
    </View>
  )
}


export default Sectiontwo;
