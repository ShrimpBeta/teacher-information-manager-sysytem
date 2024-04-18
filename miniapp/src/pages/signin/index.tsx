import { PropsWithChildren, useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';
import { isEmail } from 'class-validator';
import { Eye, Marshalling } from '@nutui/icons-react-taro';
import { userSlice } from '@/store/slices/userSlice';
import { signInMutation, wechatLoginMutation } from '@/graphql/mutation/user.mutation.graphql';
import { SignInResponse, WechatLoginResponse } from '@/models/models/user.model';
import {
  Form, Button, Input, Dialog,
  type FormItemRuleWithoutValidator,
} from '@nutui/nutui-react-taro'

import './index.scss';



const Signin = (props: PropsWithChildren) => {
  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  const [visible, setVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string>('')
  const [hidePassword, setHidePassword] = useState(true);
  const dispatch = useDispatch();

  const [signIn] = useMutation(signInMutation);
  const [wechatLogin] = useMutation(wechatLoginMutation);

  const passwordValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (value === '') {
      return true;
    }
    return /\d/.test(value) && /[a-zA-Z]/.test(value);
  }

  const emailValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (value === '') {
      return true;
    }
    return isEmail(value);
  }


  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
    setVisible(true)
  }

  const submitSucceed = (values) => {
    let { email, password } = values as { email: string, password: string };
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
      } else {
        Taro.showToast({
          title: '网络错误，请重试',
          icon: 'error',
          duration: 2000,
        });
      }
    });

  }

  const LoginByWechat = () => {
    Taro.login({
      success: (res) => {
        if (res) {
          wechatLogin({
            variables: {
              code: res.code
            }
          }).then((res) => {
            let signInData = (res as WechatLoginResponse).data?.wechatLogin;
            if (!signInData) {
              Taro.showToast({
                title: '登录失败',
                icon: 'error',
                duration: 2000
              });
              return;
            }
            let { token, user } = signInData;
            Taro.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
            dispatch(userSlice.actions.login({ token, user }));
            let pages = Taro.getCurrentPages();
            if (pages.length > 1) {
              Taro.navigateBack();
            } else {
              Taro.switchTab({ url: '/pages/index/index' });
            }
          }).catch((err) => {
            Taro.showToast({
              title: '登录失败',
              icon: 'error',
              duration: 2000
            });
          });
        } else {
          Taro.showToast({
            title: '获取code失败',
            icon: 'error',
            duration: 2000
          });
        }
      }
    })
  }

  return (
    <View className='container'>
      <View className='form-container'>
        <Form
          divider
          labelPosition='left'
          onFinish={(values) => submitSucceed(values)}
          onFinishFailed={(values, errors) => submitFailed(errors)}
          footer={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Button formType='submit' type='primary'>
                提交
              </Button>
              <Button formType='reset' style={{ marginLeft: '20px' }}>
                重置
              </Button>
            </div>
          }
        >
          <Form.Item
            label='邮箱'
            name='email'
            rules={[
              { required: true, message: '请输入邮箱' },
              { validator: emailValidator, message: '邮箱格式错误' },
            ]}
            validateTrigger='onBlur'
          >
            <Input placeholder='请输入邮箱' type='email' />
          </Form.Item>

          <Form.Item
            label='密码'
            name='password'
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度至少8位' },
              { validator: passwordValidator, message: '密码格式错误' },
            ]}
            validateTrigger='onBlur'
          >
            <Input placeholder='请输入密码' type={hidePassword ? 'password' : 'text'}
              onFocus={() => setHidePassword(false)} onBlur={() => setHidePassword(true)} />

          </Form.Item>
        </Form>
      </View>

      <Dialog
        title='输入错误'
        visible={visible}
        confirmText='确认'
        hideCancelButton
        onConfirm={() => setVisible(false)}
      >
        {errorMessages}
      </Dialog>

      <View className='bottom-container'>
        <img onClick={LoginByWechat} alt='微信登录' src='https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon64_appwx_logo.png' />
        <Text>微信登录</Text>
      </View>
    </View>
  );
}

export default Signin;
