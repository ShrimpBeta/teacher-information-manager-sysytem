import { PropsWithChildren, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import {
  Form, Button, Input, Dialog,
  type FormItemRuleWithoutValidator,
} from '@nutui/nutui-react-taro'

import './index.scss'


const Updateuserinfo = (props: PropsWithChildren) => {

  const [visible, setVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string>('')

  useEffect(() => { }, [])

  useDidShow(() => { })

  useDidHide(() => { })

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
    setVisible(true)
  }

  const submitSucceed = (values: any) => {

  }

  const phonenumberValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (value === '') {
      return true
    } else {
      return !/^1[3456789]\d{9}$/.test(value)
    }
  }

  return (
    <View className='w-full h-screen flex flex-col items-center'>
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
          label='用户名'
          name='username'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder='请输入用户名' type='text' />
        </Form.Item>
        <Form.Item
          label='手机号码'
          name='phonenumber'
          rules={[
            { validator: phonenumberValidator, message: '手机号错误' },
          ]}
        >
          <Input placeholder='请输入手机号' type='text' />
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

export default Updateuserinfo;
