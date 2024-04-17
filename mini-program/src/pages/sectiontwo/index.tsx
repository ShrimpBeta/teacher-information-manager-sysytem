import { PropsWithChildren, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import './index.scss'
import config from './index.config'

const Sectiontwo = (props: PropsWithChildren) => {
  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  return (
    <View className='sectiontwo'>
      <Text>Hello world!</Text>
    </View>
  )
}

Sectiontwo.config = config;

export default Sectiontwo;
