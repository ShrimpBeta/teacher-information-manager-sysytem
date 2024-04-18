import { PropsWithChildren, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import {
  Form, Button, Input, Dialog,
  type FormItemRuleWithoutValidator,
} from '@nutui/nutui-react-taro'

import './index.scss'
import { RootState } from '@/store/slices/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@apollo/client'
import { updateUserMutation } from '@/graphql/mutation/user.mutation.graphql'
import { UpdateUserResponse } from '@/models/models/user.model'
import { userSlice } from '@/store/slices/userSlice'


const Updateuserinfo = (props: PropsWithChildren) => {

  const user = useSelector((state: RootState) => state.userData.user)
  const dispatch = useDispatch()

  const [updateUser] = useMutation(updateUserMutation);

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
    let { username, phonenumber } = values

    updateUser({
      variables: {
        userId: user?.id,
        userData: {
          username: username,
          phoneNumber: phonenumber
        }
      }
    }).then((res) => {
      let user = (res as UpdateUserResponse).data?.updateUser;
      if (user) {
        dispatch(userSlice.actions.updateUserInfo(user));
        Taro.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        });
      } else {
        Taro.showToast({
          title: '更新失败',
          icon: 'error',
          duration: 2000
        });
      }
    }
    ).catch((err) => {
      console.log(err)
      Taro.showToast({
        title: '更新失败',
        icon: 'error',
        duration: 2000
      });
    })
  }

  const phonenumberValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (value === '') {
      return true
    } else {
      return /^1[3456789]\d{9}$/.test(value)
    }
  }

  return (
    <View className=''>
      <Form
        divider
        initialValues={{ username: user?.username, phonenumber: user?.phoneNumber }}
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
          validateTrigger='onBlur'
        >
          <Input placeholder='请输入用户名' type='text' />
        </Form.Item>
        <Form.Item
          label='手机号码'
          name='phonenumber'
          rules={[
            { validator: phonenumberValidator, message: '手机号错误' },
          ]}
          validateTrigger='onBlur'
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
