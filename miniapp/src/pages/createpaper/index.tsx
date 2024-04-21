import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue } from "@nutui/nutui-react-taro"
import './index.scss'
import Taro from '@tarojs/taro'
import { useMutation, useQuery } from '@apollo/client'

import { UserExport } from '@/models/models/user.model'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import { userExportsQuery } from '@/graphql/query/user.query.graphql'
import { Close } from '@nutui/icons-react-taro'
import { createPaperMutation } from '@/graphql/mutation/paper.mutation.graphql'
import { EditPaper } from '@/models/models/paper.model'

function Index() {

  const user = useSelector((state: RootState) => state.userData.user);

  const { data: UsersData } = useQuery(userExportsQuery, { fetchPolicy: 'network-only' });

  const [createPaper] = useMutation(createPaperMutation);

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

  const submitSucceed = async (values: any) => {

    let { title, teachersOut, journalName, journalLevel, rank } = values;

    let createPaperData = new EditPaper();
    createPaperData.title = title;
    createPaperData.teachersOut = teachersOut.split(/[,，]/);
    createPaperData.publishDate = publishDate;
    createPaperData.rank = rank;
    createPaperData.journalName = journalName;
    createPaperData.journalLevel = journalLevel;

    if (teachersIn.length > 0) {
      createPaperData.teachersIn = teachersIn.map((teacher) => teacher.id);
    }

    console.log(createPaperData);

    createPaper({
      variables: {
        paperData: createPaperData
      }
    }).then((res) => {
      Taro.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          Taro.navigateBack();
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
        <Form.Item label='论文题目' name='title' validateTrigger='onBlur' rules={[{ required: true, message: '项目名不能为空' }]} >
          <Input placeholder='请输入论文题目' type='text' />
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
        <Form.Item label='发表时间' name='publishDate' validateTrigger='onBlur'>
          <Cell
            title="选择日期"
            description={publishDate ? `${publishDate}` : '请选择'}
            onClick={() => setPublishDateVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
        <Form.Item label='期刊名称' name='journalName' validateTrigger='onBlur'>
          <Input placeholder='请输入期刊名称' type='text' />
        </Form.Item>
        <Form.Item label='期刊级别' name='journalLevel' validateTrigger='onBlur'>
          <Input placeholder='请输入期刊级别' type='text' />
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
