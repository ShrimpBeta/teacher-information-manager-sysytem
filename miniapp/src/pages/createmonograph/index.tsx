import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue, FormItemRuleWithoutValidator } from "@nutui/nutui-react-taro"
import './index.scss'
import Taro from '@tarojs/taro'
import { useMutation, useQuery } from '@apollo/client'
import { UserExport } from '@/models/models/user.model'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import { userExportsQuery } from '@/graphql/query/user.query.graphql'
import { Close } from '@nutui/icons-react-taro'
import { createMonographMutation } from '@/graphql/mutation/monograph.mutation.graphql'
import { EditMonograph } from '@/models/models/monograph.model'

function Index() {

  const user = useSelector((state: RootState) => state.userData.user);

  const { data: UsersData } = useQuery(userExportsQuery, { fetchPolicy: 'network-only' });

  const [createMonograph] = useMutation(createMonographMutation);

  const [users, setUsers] = useState<UserExport[]>([]);

  const [teachersIn, setTeachersIn] = useState<UserExport[]>([]);
  const [publishDate, setPublishDate] = useState<Date | null>(null);

  const [teachersInSelectVisible, setTeachersInSelectVisible] = useState(false);
  const [publishDateVisible, setPublishDateVisible] = useState(false);

  const handleDeleteTeacherIn = (index: number) => {
    const newTeachersIn = [...teachersIn];
    newTeachersIn.splice(index, 1);
    setTeachersIn(newTeachersIn);
  }

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
  }

  const submitSucceed = (values: any) => {

    const { title, teachersOut, publishLevel, rank } = values

    let createMonographData = new EditMonograph();
    createMonographData.title = title;
    createMonographData.teachersOut = teachersOut.split(/[,，]/);
    createMonographData.publishLevel = publishLevel;
    createMonographData.rank = rank;

    if (publishDate) {
      createMonographData.publishDate = publishDate;
    }

    if (teachersIn.length > 0) {
      createMonographData.teachersIn = teachersIn.map((item) => item.id);
    }

    createMonograph({
      variables: {
        monographData: createMonographData
      }
    }).then((res) => {
      Taro.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          Taro.navigateBack()
        }
      })
    }).catch((error) => {
      Taro.showToast({
        title: '创建失败',
        icon: 'none',
        duration: 2000
      })
    })

  }

  useEffect(() => {
    if (UsersData) {
      let userExports = UsersData.userExports;
      if (userExports) {
        const userExportsFilter = userExports.filter((item: UserExport) => {
          return item.id !== user?.id;
        });
        console.log(userExportsFilter);
        setUsers(userExportsFilter);
      }
    }
  }, [UsersData])

  const dateValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (publishDate !== null) {
      return true
    } else {
      return false;
    }
  }

  return (
    <View style={{ width: '100%', height: '100vh' }}>

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
            <Button formType='reset' style={{ marginLeft: '20px' }}
              onClick={() => {
                setPublishDate(null)
                setTeachersIn([])
              }}>
              重置
            </Button>
          </div>
        }
      >
        <Form.Item label='专著名称' name='title' validateTrigger='onBlur' rules={[{ required: true, message: '项目名不能为空' }]} >
          <Input placeholder='请输入专著名称' type='text' />
        </Form.Item>
        <Form.Item label='系统内教师' name='teachersIn' validateTrigger='onBlur'>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <View style={{ display: 'flex', alignItems: 'center', gap: '10rpx', height: '60rpx', paddingLeft: '20rpx' }}>
              {teachersIn.map((item, index) => (
                <View key={index} style={{ display: 'flex', alignItems: 'center', gap: '5rpx', backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '30rpx', paddingLeft: '20rpx' }}>
                  <Text>{item.username}</Text>
                  <Button size='small' fill="none" onClick={() => handleDeleteTeacherIn(index)}><Close /></Button>
                </View>
              ))}
            </View>
            <Cell
              title="选择系统内教师"
              description='点击选择系统内教师'
              onClick={() => setTeachersInSelectVisible(true)}
              style={{ padding: '0', paddingTop: '20rpx' }}
            />
          </View>
        </Form.Item>
        <Form.Item label='系统外教师' name='teachersOut' validateTrigger='onBlur'>
          <Input placeholder='请输入系统外教师，多个以 "," "，" 隔开 ' type='text' />
        </Form.Item>
        <Form.Item label='出版日期' name='publishDate' validateTrigger='onBlur' rules={[{validator:dateValidator,message:'出版日期不能为空'}]}>
          <Cell
            title="选择日期"
            description={publishDate ? `${publishDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}` : '请选择'}
            onClick={() => setPublishDateVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
        <Form.Item label='出版级别' name='publishLevel' validateTrigger='onBlur'>
          <Input placeholder='请输入出版级别' type='text' />
        </Form.Item>
        <Form.Item label='排名' name='rank' validateTrigger='onBlur'>
          <Input placeholder='请输入排名' type='text' />
        </Form.Item>

      </Form>

      <Popup
        title="选择日期"
        visible={publishDateVisible}
        position="bottom"
        closeable
        onClose={() => setPublishDateVisible(false)}
      >
        <CalendarCard
          onChange={(d: CalendarCardValue) => setPublishDate(d as Date)}
        />
        <div style={{ padding: '10px' }}>
          <Button block type="danger" onClick={() => setPublishDateVisible(false)}>
            确定
          </Button>
        </div>
      </Popup>

      <Popup
        title="选择系统内教师"
        visible={teachersInSelectVisible}
        position="bottom"
        closeable
        onClose={() => setTeachersInSelectVisible(false)}
      >
        <View style={{ padding: '10px' }}>
          {users.map((item, index) => (
            <Button key={index} block onClick={() => {
              let isExist = teachersIn.some((teacher) => teacher.id === item.id);
              if (isExist) {
                setTeachersInSelectVisible(false);
                return;
              }
              setTeachersIn([...teachersIn, item]);
              setTeachersInSelectVisible(false);
            }}>{item.username}</Button>
          ))}
        </View>
      </Popup>
    </View>
  )
}

export default Index
