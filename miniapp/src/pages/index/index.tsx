import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@apollo/client'
import { ApolloError } from '@apollo/client/errors'
import { Tabbar } from '@nutui/nutui-react-taro'
import { User, Receipt } from '@nutui/icons-react-taro'
import { RootState } from '@/store/slices/reducers'
import { userSlice } from '@/store/slices/userSlice'
import { JWT } from '@/auth/jwt'
import CustomTabbar from '@/custom-tab-bar/index'

import './index.scss'

const Index = (props: PropsWithChildren) => {
  const user = useSelector((state: RootState) => state.userData.user);
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

  useDidHide(() => { });




  return (
    <>
      <View className='index'>
        <Text>Hello</Text>
        <Text>{user?.email}</Text>
        <Text>{user?.username}</Text>
      </View>
    </>
  )

}

export default Index;
