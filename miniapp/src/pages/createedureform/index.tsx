import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue } from "@nutui/nutui-react-taro"
import './index.scss'
import Taro from '@tarojs/taro'
import { useMutation, useQuery } from '@apollo/client'
import { createEduReformMutation } from '@/graphql/mutation/edureform.mutation.graphql'
import { EditEduReform } from '@/models/models/eduReform.model'
import { UserExport } from '@/models/models/user.model'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import { userExportsQuery } from '@/graphql/query/user.query.graphql'
import { Close } from '@nutui/icons-react-taro'

function Index() {

  const user = useSelector((state: RootState) => state.userData.user);

  const { data: UsersData } = useQuery(userExportsQuery, { fetchPolicy: 'network-only' });

  const [createEduReform] = useMutation(createEduReformMutation);

  const [users, setUsers] = useState<UserExport[]>([]);

  const [teachersIn, setTeachersIn] = useState<UserExport[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null)

  const [teachersInSelectVisible, setTeachersInSelectVisible] = useState(false)
  const [startDateVisible, setStartDateVisible] = useState(false)

  const handleDeleteTeacherIn = (index: number) => {
    const newTeachersIn = [...teachersIn];
    newTeachersIn.splice(index, 1);
    setTeachersIn(newTeachersIn);
  }

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
  }

  const submitSucceed = (values: any) => {
    let { title, number, teachersOut, duration, level, rank, achievement, fund } = values

    let createEduReformData = new EditEduReform();
    createEduReformData.title = title;
    createEduReformData.number = number;
    createEduReformData.teachersOut = teachersOut.split(/[,，]/);
    createEduReformData.duration = duration;
    createEduReformData.level = level;
    createEduReformData.rank = rank;
    createEduReformData.achievement = achievement;
    createEduReformData.fund = fund;

    if (startDate) {
      createEduReformData.startDate = startDate;
    }

    if (teachersIn.length > 0) {
      createEduReformData.teachersIn = teachersIn.map((teacher) => teacher.id);
    }

    console.log(createEduReformData)

    createEduReform({
      variables: {
        eduReformData: createEduReformData
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
                setStartDate(null)
                setTeachersIn([])
              }}>
              重置
            </Button>
          </div>
        }
      >
        <Form.Item label='项目名称' name='title' validateTrigger='onBlur' rules={[{ required: true, message: '项目名不能为空' }]} >
          <Input placeholder='请输入项目名称' type='text' />
        </Form.Item>
        <Form.Item label='项目编号' name='number' validateTrigger='onBlur' rules={[{ required: true, message: '学生姓名不能为空' }]}>
          <Input placeholder='请输入项目编号' />
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
        <Form.Item label='项目开始' name='startDate' validateTrigger='onBlur'>
          <Cell
            title="选择日期"
            description={startDate ? `${startDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}` : '请选择'}
            onClick={() => setStartDateVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
        <Form.Item label='项目持续时间' name='duration' validateTrigger='onBlur'>
          <Input placeholder='请输入项目持续时间' type='text' />
        </Form.Item>
        <Form.Item label='项目级别' name='level' validateTrigger='onBlur'>
          <Input placeholder='请输入项目级别' type='text' />
        </Form.Item>
        <Form.Item label='项目排名' name='rank' validateTrigger='onBlur'>
          <Input placeholder='请输入项目排名' type='text' />
        </Form.Item>
        <Form.Item label='项目成果' name='achievement' validateTrigger='onBlur'>
          <Input placeholder='请输入项目成果' type='text' />
        </Form.Item>
        <Form.Item label='项目基金' name='fund' validateTrigger='onBlur'>
          <Input placeholder='请输入项目基金' type='text' />
        </Form.Item>

      </Form>

      <Popup
        title="选择日期"
        visible={startDateVisible}
        position="bottom"
        closeable
        onClose={() => setStartDateVisible(false)}
      >
        <CalendarCard
          onChange={(d: CalendarCardValue) => setStartDate(d as Date)}
        />
        <div style={{ padding: '10px' }}>
          <Button block type="danger" onClick={() => setStartDateVisible(false)}>
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
