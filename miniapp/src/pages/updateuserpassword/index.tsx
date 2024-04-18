import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import {
  Form, Button, Input, Dialog,
  type FormItemRuleWithoutValidator,
} from '@nutui/nutui-react-taro'

import './index.scss'

import { RootState } from '@/store/slices/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { ApolloError, useMutation } from '@apollo/client'
import { userSlice } from '@/store/slices/userSlice'
import { updateUserPasswordMutation } from '@/graphql/mutation/user.mutation.graphql'
import { UpdateUserPasswordResponse } from '@/models/models/user.model'
import Taro from '@tarojs/taro'

const Updateuserpassword = (props: PropsWithChildren) => {

  const user = useSelector((state: RootState) => state.userData.user)
  const dispatch = useDispatch()

  const [updateUserPassword] = useMutation(updateUserPasswordMutation);

  const [visible, setVisible] = useState(false)
  const [hiddenOldPassword, setHiddenOldPassword] = useState(true)
  const [hiddenNewPassword, setHiddenNewPassword] = useState(true)
  const [errorMessages, setErrorMessages] = useState<string>('')

  const passwordValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (value === '') {
      return true;
    }
    return /\d/.test(value) && /[a-zA-Z]/.test(value);
  }

  const submitSucceed = (values: any) => {

    let { oldpassword, password, repeatpassword } = values as { oldpassword: string, password: string, repeatpassword: string };

    if (password !== repeatpassword) {
      setErrorMessages('两次密码不一致')
      setVisible(true)
      return;
    }

    updateUserPassword({
      variables: {
        userId: user?.id,
        passwordData: {
          oldPassword: oldpassword,
          newPassword: password
        }
      }
    }).then((res) => {
      let success = (res as UpdateUserPasswordResponse).data?.updateAccountPassword
      if (success) {
        Taro.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        });
      }
    }).catch((error) => {
      if (error instanceof ApolloError) {
        if (error.graphQLErrors) {
          Taro.showToast({
            title: error.graphQLErrors[0].message,
            icon: 'none',
            duration: 2000
          });
        } else {
          Taro.showToast({
            title: '网络错误，请重试',
            icon: 'error',
            duration: 2000,
          });
        }
      }
    });

  }

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
    setVisible(true)
  }


  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  return (
    <View className='' >
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
          label='旧密码'
          name='oldpassword'
          rules={[{ required: true, message: '请输入旧密码' }]}
          validateTrigger='onBlur'
        >
          <Input placeholder='请输入旧密码' type={hiddenOldPassword ? 'password' : 'text'}
            onFocus={() => setHiddenOldPassword(false)}
            onBlur={() => setHiddenOldPassword(true)}
          />
        </Form.Item>
        <Form.Item
          label='密码'
          name='password'
          rules={[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码长度至少8位' },
            { validator: passwordValidator, message: '密码错误' },
          ]}
          validateTrigger='onBlur'
        >
          <Input placeholder='请输入密码' type={hiddenNewPassword ? 'password' : 'text'}
            onFocus={() => setHiddenNewPassword(false)}
            onBlur={() => setHiddenNewPassword(true)}
          />
        </Form.Item>
        <Form.Item
          label='确认密码'
          name='repeatpassword'
          rules={[
            { required: true, message: '请输入确认密码' },
            { min: 8, message: '密码长度至少8位' },
            { validator: passwordValidator, message: '确认密码错误' },
          ]}
          validateTrigger='onBlur'
        >
          <Input placeholder='请输入确认密码' type={hiddenNewPassword ? 'password' : 'text'}
            onFocus={() => setHiddenNewPassword(false)}
            onBlur={() => setHiddenNewPassword(true)}
          />
        </Form.Item>
      </Form>

      <Dialog
        title='输入错误'
        visible={visible}
        confirmText='确认'
        hideCancelButton
        onConfirm={() => setVisible(false)}
      >
        {errorMessages}
      </Dialog>
    </View>
  )
}

export default Updateuserpassword;
