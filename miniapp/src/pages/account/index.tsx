import { PropsWithChildren, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import { Divider, Button, Avatar, Cell } from '@nutui/nutui-react-taro';
import { useMutation } from '@apollo/client'
import { addWechatAuthMutation, removeWechatAuthMutation } from '@/graphql/mutation/user.mutation.graphql'
import { userSlice } from '@/store/slices/userSlice'
import { ArrowRight } from '@nutui/icons-react-taro'
import { JWT } from '@/auth/jwt'

import './index.scss'

const Account = (props: PropsWithChildren) => {
  const user = useSelector((state: RootState) => state.userData.user);

  const dispatch = useDispatch();

  const [addWechatAuth] = useMutation(addWechatAuthMutation);
  const [removeWechatAuth] = useMutation(removeWechatAuthMutation);

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

  const AddWechatAuth = () => {
    Taro.login({
      success: function (res) {
        if (res) {
          console.log(res.code);
          addWechatAuth({
            variables: {
              userId: user?.id,
              code: res.code
            }
          }).then((res) => {
            Taro.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2000
            });
          }).catch((err) => {
            Taro.showToast({
              title: '绑定失败',
              icon: 'error',
              duration: 2000
            });
          });

        } else {
          Taro.showToast({
            title: '登录失败',
            icon: 'error',
            duration: 2000
          });
        }
      }
    });
  }

  const RemoveWechatAuth = () => {
    removeWechatAuth({
      variables: {
        userId: user?.id
      }
    }).then((res) => {
      Taro.showToast({
        title: '解除成功',
        icon: 'success',
        duration: 2000
      });
      let userTemp = Object.assign({}, user);
      userTemp.wechatAuth = false;
      dispatch(userSlice.actions.updateUserInfo(userTemp));
    }).catch((err) => {
      Taro.showToast({
        title: '解除失败',
        icon: 'error',
        duration: 2000
      });
    });
  }

  const logout = () => {
    dispatch(userSlice.actions.logout());
    Taro.navigateTo({ url: '/pages/signin/index' });
  }

  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  return (
    <View className='container'>
      <View className='header'>
        <View className='avatar'>
          <Avatar size="large" src={user?.avatar} alt='头像' />
        </View>
        <View className=' w-full flex flex-col items-center rounded-md bg-white mt-5 gap-3 box-border p-3'>
          <Text style='margin-top:20rpx'>用户名: {user?.username}</Text>
          <Divider />
          <Text>邮箱: {user?.email}</Text>
          {user?.phoneNumber && <>
            <Divider />
            <Text>手机号码: {user.phoneNumber}</Text>
          </>}
        </View>
      </View>

      <View className='actions'>
        <Cell title='修改用户信息' extra={<ArrowRight />} onClick={() => Taro.navigateTo({ url: '/pages/updateuserinfo/index' })} />
        {/* <Divider /> */}
        <Cell title='修改用户密码' extra={<ArrowRight />} onClick={() => Taro.navigateTo({ url: '/pages/updateuserpassword/index' })} />
        {/* <Divider /> */}
        {user?.wechatAuth ?
          <Cell title='解除微信认证' extra={<ArrowRight />} onClick={RemoveWechatAuth} />
          : <Cell title='绑定微信认证' extra={<ArrowRight />} onClick={AddWechatAuth} />
        }
      </View>

      <View className='bottom'>
        <Button block type='primary' size='large' onClick={logout}>退出登录</Button>
      </View>

    </View>
  )
}


export default Account;
