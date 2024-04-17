import { PropsWithChildren, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import { Divider, Button, Avatar } from '@nutui/nutui-react-taro';
import { useMutation } from '@apollo/client'
import { addWechatAuthMutation, removeWechatAuthMutation } from '@/graphql/mutation/user.mutation.graphql'

import './index.scss';
import { userSlice } from '@/store/slices/userSlice'

const Account = (props: PropsWithChildren) => {
  const user = useSelector((state: RootState) => state.userData.user);

  const dispatch = useDispatch();

  const [addWechatAuth] = useMutation(addWechatAuthMutation);
  const [removeWechatAuth] = useMutation(removeWechatAuthMutation);

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
            <Text>{user.phoneNumber}</Text>
          </>}
        </View>
      </View>

      <View className='actions'>
        <Button block fill='none' onClick={() => Taro.navigateTo({ url: '/pages/updateuserinfo/index' })}>
          修改用户信息
        </Button>
        <Divider />
        <Button block fill='none' onClick={() => Taro.navigateTo({ url: '/pages/updateuserpassword/index' })}>
          修改用户密码
        </Button>
        <Divider />
        {user?.wechatAuth ?
          <Button block fill='none' onClick={RemoveWechatAuth}>解除微信认证</Button>
          : <Button block fill='none' onClick={AddWechatAuth}>绑定微信认证</Button>
        }
      </View>

      <View className='bottom'>
        <Button block type='primary' size='large' onClick={logout}>退出登录</Button>
      </View>

    </View>
  )
}


export default Account;
