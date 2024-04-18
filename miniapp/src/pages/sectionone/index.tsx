import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { Tabs } from '@nutui/nutui-react-taro'
import './index.scss'
import OverviewClassSchedule from '@/components/overviewclassschedule'
import OverviewPassword from '@/components/overviewpassword'
import OverviewMentorship from '@/components/overviewmentorship'
import OverviewCompGuidance from '@/components/overviewcompguidance'
import OverviewUGPGGuidance from '@/components/overviewugpgguidance'
import OverviewEduReform from '@/components/overviewedureform'

const Sectionone = (props: PropsWithChildren) => {
  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  const [tabvalue, setTabvalue] = useState<string | number>('0')

  return (
    <View className='sectionone'>
      <Tabs
        value={tabvalue}
        onChange={(value) => {
          setTabvalue(value)
        }}
        activeType="button">
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
