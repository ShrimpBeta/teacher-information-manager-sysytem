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
      <View className='w-full px-5 py-2'>
        <Form>
          <Input type='email' value={email} onInput={(e) => setEmail(e.detail.value)} placeholder='Email' />
          <Input type='password' password value={password} onInput={(e) => setPassword(e.detail.value)} placeholder='Password' />
          <Button type='submit' onClick={() => handleSignIn()}>Sign In</Button>
        </Form>
      </View>
    </View>
  );
}

export default Signin;
