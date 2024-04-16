import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Button, Input, Form } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import { ApolloError } from '@apollo/client/errors'
import { userSlice } from '../../store/slices/userSlice'
import { signInMutation } from '../../graphql/mutation/user.mutation.graphql'
import './index.scss'


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
    console.log(email);
    console.log(password);

    signIn({
      variables: {
        email: email,
        password: password
      }
    }).then((res) => {
      let { token, user } = res.data.signIn;
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
          <Input type='text' className='h-14 mt-6 pl-5 bg-slate-100' password={hidePassword} value={password} onInput={(e) => setPassword(e.detail.value)} placeholder='密码' />
          <View className='flex flex-col justify-center items-center mt-6'>
            <Button type='primary' className='' formType='submit' onClick={() => handleSignIn()}>登录</Button>
          </View>
        </Form>
      </View>
    </View>
  );
}

export default Signin;
