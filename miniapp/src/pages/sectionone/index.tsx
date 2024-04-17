import { PropsWithChildren, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import './index.scss'

const Sectionone = (props: PropsWithChildren) => {
  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })


  return (
    <View className='sectionone'>
      <Text>Hello world!</Text>
    </View>
  )
}

export default Sectionone;
