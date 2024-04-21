import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import {
  Form, Button, Input, Dialog,
  type FormItemRuleWithoutValidator,
} from '@nutui/nutui-react-taro'
import { useLazyQuery, useMutation } from '@apollo/client'
import { updatePasswordMutation } from '@/graphql/mutation/password.mutation.graphql'
import './index.scss'
import { isURL } from 'class-validator'
import { EditPassword } from '@/models/models/password.model'
import { getCurrentInstance } from '@tarojs/runtime'
import { passwordTrueQuery } from '@/graphql/query/password.query.graphql'

interface InitialValuesType {
  appname: string;
  url: string;
  account: string;
  password: string;
  description: string;
}

function Index() {
  const [updatePassword] = useMutation(updatePasswordMutation);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string>('');
  const [initialValues, setInitialValues] = useState<InitialValuesType | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [passwordTrue] = useLazyQuery(passwordTrueQuery)

  const $instance = getCurrentInstance()

  useEffect(() => {
    let id = $instance.router?.params.id
    if (id) {
      passwordTrue({
        variables: {
          id: id
        }
      }).then((res) => {
        let password = res.data.passwordTrue
        if (!password) {
          Taro.showToast({
            title: '密码不存在',
            icon: 'none',
            duration: 2000
          });
          Taro.navigateBack()
        }
        console.log(password)
        setInitialValues({
          appname: password.appName,
          url: password.url,
          account: password.account,
          password: password.password,
          description: password.description
        });
        setDataLoaded(true);
      }).catch((error) => {
        console.log(error)
        Taro.showToast({
          title: '查询失败',
          icon: 'none',
          duration: 2000
        });
        Taro.navigateBack()
      })
    }
  }, []);

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
    setVisible(true)
  }

  const submitSucceed = (values: any) => {
    let { appname, url, account, password, description } = values

    let updatePasswordData = new EditPassword();
    updatePasswordData.appName = appname;
    updatePasswordData.url = url;
    updatePasswordData.account = account;
    updatePasswordData.password = password;
    updatePasswordData.description = description;

    updatePassword({
      variables: {
        id: $instance.router?.params.id,
        passwordData: updatePasswordData
      }
    }).then((res) => {
      Taro.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 2000
      });
    }).catch((error) => {
      console.log(error)
      Taro.showToast({
        title: '更新失败',
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
      {dataLoaded && <Form
        divider
        labelPosition='left'
        onFinish={(values) => submitSucceed(values)}
        onFinishFailed={(error) => submitFailed(error)}
        initialValues={initialValues}
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
      </Form>}
    </View>
  )
}

export default Index
