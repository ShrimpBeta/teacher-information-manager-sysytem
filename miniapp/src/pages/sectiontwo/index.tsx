import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { Tabs } from '@nutui/nutui-react-taro'
import './index.scss'
import OverviewMonograph from '@/components/overviewmonograph'
import OverviewPaper from '@/components/overviewpaper'
import OverviewSciResearch from '@/components/overviewscisearch'

const Sectiontwo = (props: PropsWithChildren) => {
  useEffect(() => { }, [])

  useDidShow(() => { })

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
