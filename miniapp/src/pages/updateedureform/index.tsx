import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue, FormItemRuleWithoutValidator } from "@nutui/nutui-react-taro"
import './index.scss'
import Taro from '@tarojs/taro'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { updateEduReformMutation } from '@/graphql/mutation/edureform.mutation.graphql'
import { EditEduReform } from '@/models/models/eduReform.model'
import { UserExport } from '@/models/models/user.model'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/slices/reducers'
import { userExportsQuery } from '@/graphql/query/user.query.graphql'
import { Close } from '@nutui/icons-react-taro'
import { eduReformQuery } from '@/graphql/query/edureform.query.graphql'
import { getCurrentInstance } from '@tarojs/runtime'


interface InitialValuesType {
  title: string;
  number: string;
  teachersOut: string;
  duration: string;
  level: string;
  rank: string;
  achievement: string;
  fund: string;
}

function Index() {

  const [edureform] = useLazyQuery(eduReformQuery)

  const user = useSelector((state: RootState) => state.userData.user);

  const { data: UsersData } = useQuery(userExportsQuery, { fetchPolicy: 'network-only' });

  const [updateEduReform] = useMutation(updateEduReformMutation);

  const [users, setUsers] = useState<UserExport[]>([]);

  const [initialValues, setInitialValues] = useState<InitialValuesType | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [teachersIn, setTeachersIn] = useState<UserExport[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null)

  const [teachersInSelectVisible, setTeachersInSelectVisible] = useState(false)
  const [startDateVisible, setStartDateVisible] = useState(false)

  const $instance = getCurrentInstance()

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

    let updateEduReformData = new EditEduReform();
    updateEduReformData.title = title;
    updateEduReformData.number = number;
    updateEduReformData.teachersOut = teachersOut.split(/[,，]/);
    updateEduReformData.duration = duration;
    updateEduReformData.level = level;
    updateEduReformData.rank = rank;
    updateEduReformData.achievement = achievement;
    updateEduReformData.fund = fund;

    if (startDate) {
      updateEduReformData.startDate = startDate;
    }

    if (teachersIn.length > 0) {
      updateEduReformData.teachersIn = teachersIn.map((teacher) => teacher.id).filter((id) => id !== user?.id);
    }

    console.log(updateEduReformData)

    updateEduReform({
      variables: {
        id: $instance.router?.params.id,
        eduReformData: updateEduReformData
      }
    }).then((res) => {
      Taro.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 2000,
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

  useEffect(() => {
    if ($instance.router?.params.id) {
      edureform({
        variables: {
          id: $instance.router?.params.id
        }
      }).then((res) => {
        let eduReform = res.data.eduReform;
        if (!eduReform) {
          Taro.showToast({
            title: '记录不存在',
            icon: 'none',
            duration: 2000
          });
          Taro.navigateBack()
        }
        setInitialValues({
          title: eduReform.title,
          number: eduReform.number,
          teachersOut: eduReform.teachersOut.join(','),
          duration: eduReform.duration,
          level: eduReform.level,
          rank: eduReform.rank,
          achievement: eduReform.achievement,
          fund: eduReform.fund
        });
        if (eduReform.startDate) {
          setStartDate(new Date(eduReform.startDate))
        }
        if (eduReform.teachersIn.length > 0) {
          setTeachersIn(eduReform.teachersIn);
        }
        setDataLoaded(true);
      }).catch((error) => {
        console.log(error)
        Taro.showToast({
          title: '获取数据失败',
          icon: 'none',
          duration: 2000
        });
      })
    }
  }, [])

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
    if (startDate !== null) {
      return true
    } else {
      return false;
    }
  }

  return (
    <View style={{ width: '100%', height: '100vh' }}>

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
        <Form.Item label='项目开始日期' name='startDate' validateTrigger='onBlur' rules={[{validator:dateValidator,message:'项目开始日期不能为空'}]}>
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
      </Form>}

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
