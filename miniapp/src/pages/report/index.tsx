import { PropsWithChildren, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import './index.scss'

const Report = (props: PropsWithChildren) => {

  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  return (
    <View className='report'>
      <Text>Hello world!</Text>
    </View>
  )

}

export default Report;
