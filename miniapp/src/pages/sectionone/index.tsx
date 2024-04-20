import { PropsWithChildren, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { Tabs } from '@nutui/nutui-react-taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import Taro from '@tarojs/taro'
import { JWT } from '@/auth/jwt'

import OverviewClassSchedule from '@/components/overviewclassschedule'
import OverviewPassword from '@/components/overviewpassword'
import OverviewMentorship from '@/components/overviewmentorship'
import OverviewCompGuidance from '@/components/overviewcompguidance'
import OverviewUGPGGuidance from '@/components/overviewugpgguidance'
import OverviewEduReform from '@/components/overviewedureform'

import './index.scss'

const Sectionone = (props: PropsWithChildren) => {

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
    <View className='sectionone'>
      <Tabs
        value={tabvalue}
        onChange={(value) => {
          setTabvalue(value)
        }}
        activeType="button"
        // autoHeight
        style={{ height: '100%' }}
      >
        <Tabs.TabPane title="密码管理"> <OverviewPassword /> </Tabs.TabPane>
        <Tabs.TabPane title="课程表"> <OverviewClassSchedule /> </Tabs.TabPane>
        <Tabs.TabPane title="导师制"> <OverviewMentorship /> </Tabs.TabPane>
        <Tabs.TabPane title="竞赛指导"> <OverviewCompGuidance /></Tabs.TabPane>
        <Tabs.TabPane title="毕设指导"> <OverviewUGPGGuidance /> </Tabs.TabPane>
        <Tabs.TabPane title="教改项目"><OverviewEduReform /> </Tabs.TabPane>
      </Tabs>
    </View>
  )
}

export default Sectionone;
