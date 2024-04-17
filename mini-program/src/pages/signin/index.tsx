import { PropsWithChildren, useEffect, useState } from 'react';
import { View, Button, Input, Form } from '@tarojs/components';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';
import { isEmail } from 'class-validator';
import { Eye, Marshalling } from '@nutui/icons-react-taro';
import { userSlice } from '@/store/slices/userSlice';
import { signInMutation } from '@/graphql/mutation/user.mutation.graphql';
import { SignInResponse } from '@/models/models/user.model';
import './index.scss';



const Signin = (props: PropsWithChildren) => {
  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const dispatch = useDispatch();

  const [signIn] = useMutation(signInMutation);

  const handleSignIn = () => {

    if (email === '' || password === '') {
      Taro.showToast({
        title: '邮箱或密码不能为空',
        icon: 'error',
        duration: 2000,
      });
      return;
    }

    if (isEmail(email) === false) {
      Taro.showToast({
        title: '邮箱格式错误',
        icon: 'error',
        duration: 2000,
      });
      return;
    }

    let signin = {
      email: email,
      password: password
    };

    signIn({
      variables: {
        signInData: signin
      }
    }).then((res) => {
      let signInData = (res as SignInResponse).data?.signIn;
      if (signInData) {
        let { token, user } = signInData;

        if (user.activate === false) {
          Taro.showToast({
            title: '请先网页激活',
            icon: 'error',
            duration: 2000,
          });
          return;
        }

        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000,
        });
        dispatch(userSlice.actions.login({ token, user }));
        let pages = Taro.getCurrentPages();
        if (pages.length > 1) {
          Taro.navigateBack();
        } else {
          Taro.redirectTo({ url: '/pages/index/index' });
        }
      }
    }).catch((error) => {
      if (error instanceof ApolloError) {
        if (error.graphQLErrors) {
          Taro.showToast({
            title: '密码或账户错误',
            icon: 'error',
            duration: 2000,
          });
          return;
        }
      }
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'error',
        duration: 2000,
      });
    });

  }

  return (
    <View className='w-full h-screen flex justify-center items-center'>
      <View className='w-full px-10 py-2'>
        <Form className='flex flex-col gap-4'>
          <Input type='text' className='h-14 pl-5 bg-slate-100' value={email} onInput={(e) => setEmail(e.detail.value)} placeholder='邮箱' focus />
          <View className='flex flex-row w-full h-14 mt-6 items-center relative'>
            <Input type='text' className='w-full h-full pl-5 bg-slate-100 box-border' password={hidePassword} value={password} onInput={(e) => setPassword(e.detail.value)} placeholder='密码' />
            <Button className='w-12 h-12 z-10 absolute right-0 mr-2 rounded-full border-none bg-slate-100 flex' onClick={() => setHidePassword(!hidePassword)}>
              {hidePassword ? <Eye className='flex-shrink-0 m-auto' width='48rpx' height='58rpx' color='gray' /> :
                <Marshalling className='flex-shrink-0 m-auto' width='48rpx' height='58rpx' color='gray' />}
            </Button>
          </View>
          <View className='flex flex-col justify-center items-center mt-6'>
            <Button type='primary' className='' formType='submit' onClick={() => handleSignIn()}>登录</Button>
          </View>
        </Form>
      </View>
      <View className='fixed bottom-10 flex justify-center items-center'>
        <img alt='微信登录' className='w-44 h-10 rounded-md' src='https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon48_wx_button.png' />
      </View>
    </View>
  );
}

export default Signin;
