import React, { useState } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import {
  Form, Button, Input, Dialog,
  type FormItemRuleWithoutValidator,
} from '@nutui/nutui-react-taro'
import { useMutation } from '@apollo/client'
import { createPasswordMutation } from '@/graphql/mutation/password.mutation.graphql'
import './index.scss'
import { isURL } from 'class-validator'
import { EditPassword } from '@/models/models/password.model'

function Index() {

  const [createPassword] = useMutation(createPasswordMutation);
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string>('')

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
    setVisible(true)
  }

  const submitSucceed = (values: any) => {
    let { appname, url, account, password, description } = values

    let createPasswordData = new EditPassword();
    createPasswordData.appName = appname;
    createPasswordData.url = url;
    createPasswordData.account = account;
    createPasswordData.password = password;
    createPasswordData.description = description;

    createPassword({
      variables: {
        passwordData: createPasswordData
      }
    }).then((res) => {
      Taro.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          Taro.navigateBack()
        }
      });
    }).catch((error) => {
      console.log(error)
      Taro.showToast({
        title: '创建失败',
        icon: 'none',
        duration: 2000
      });
    })
  }

  const urlValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (value === '' || value === undefined || value === null) {
      return true
    } else {
      return isURL(value)
    }
  }

  return (
    <View className="container">
      <Form
        divider
        labelPosition='left'
        onFinish={(values) => submitSucceed(values)}
        onFinishFailed={(error) => submitFailed(error)}

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
        <Form.Item label='应用名称' name='appname' validateTrigger='onBlur'>
          <Input placeholder='请输入应用名称' type='text' />
        </Form.Item>
        <Form.Item label='网站' name='url' validateTrigger='onBlur' rules={[{ validator: urlValidator, message: 'URL格式错误' }]}>
          <Input placeholder='请输入网址' type='url' />
        </Form.Item>
        <Form.Item label='账号' name='account' validateTrigger='onBlur' rules={[{ required: true, message: '账号不能为空' }]}>
          <Input placeholder='请输入账号' type='text' />
        </Form.Item>
        <Form.Item label='密码' name='password' validateTrigger='onBlur' rules={[{ required: true, message: '密码不能为空' }]}>
          <Input placeholder='请输入密码' type={passwordVisible ? 'text' : 'password'} onFocus={() => setPasswordVisible(true)} onBlur={() => setPasswordVisible(false)} />
        </Form.Item>
        <Form.Item label='描述' name='description' validateTrigger='onBlur'>
          <Input placeholder='请输入描述' type='text' />
        </Form.Item>
      </Form>
    </View>
  )
}

export default Index
