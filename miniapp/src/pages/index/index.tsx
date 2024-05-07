import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidHide, useDidShow } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { ApolloError } from '@apollo/client/errors'
import { Checkbox, Popup, Button, Cell, CalendarCard, type CalendarCardValue } from '@nutui/nutui-react-taro'
import { RootState } from '@/store/slices/reducers'
import { JWT } from '@/auth/jwt'

import './index.scss'
import { UserExport } from '@/models/models/user.model'
import { userExportsQuery } from '@/graphql/query/user.query.graphql'
import { Close } from '@nutui/icons-react-taro'
import { reportQuery } from '@/graphql/query/report.query.graphql'
import { ReportFilter } from '@/models/models/report.model'

const Index = (props: PropsWithChildren) => {
  const user = useSelector((state: RootState) => state.userData.user);
  const token = useSelector((state: RootState) => state.userData.token);

  const { data: UsersData } = useQuery(userExportsQuery, { fetchPolicy: 'network-only' });

  const [report, { data, loading, error }] = useLazyQuery(reportQuery, { fetchPolicy: 'network-only' });

  const [users, setUsers] = useState<UserExport[]>([]);

  const [classScheduleCheck, setClassScheduleCheck] = useState(true);
  const [mentorshipCheck, setMentorshipCheck] = useState(true);
  const [compGuidanceCheck, setCompGuidanceCheck] = useState(true);
  const [uGPGGuidanceCheck, setUGPGGuidanceCheck] = useState(true);
  const [eduReformCheck, setEduReformCheck] = useState(true);
  const [monographCheck, setMonographCheck] = useState(true);
  const [paperCheck, setPaperCheck] = useState(true);
  const [sciResearchCheck, setSciResearchCheck] = useState(true);
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [teachersIn, setTeachersIn] = useState<UserExport[]>([]);
  const [specifyTeacherIn, setSpecifyTeacherIn] = useState(false);

  const [teachersInSelectVisible, setTeachersInSelectVisible] = useState(false)
  const [datePickerVisible, setDatePickerVisible] = useState(false)

  const handleDeleteTeacherIn = (index: number) => {
    const newTeachersIn = [...teachersIn];
    newTeachersIn.splice(index, 1);
    setTeachersIn(newTeachersIn);
  }

  useEffect(() => {
    if (token === '') {
      // 未登录
      Taro.navigateTo({ url: '/pages/signin/index' });
    } else {
      // token过期
      if (JWT.getTokenExpiration(token)) {
        Taro.navigateTo({ url: '/pages/signin/index' });
      }
    }
  }, [token]);

  useDidShow(() => {
    // 防止返回可访问
    if (token === '') {
      // 未登录
      Taro.navigateTo({ url: '/pages/signin/index' });
    } else {
      // token过期
      if (JWT.getTokenExpiration(token)) {
        Taro.navigateTo({ url: '/pages/signin/index' });
      }
    }
  });

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


  useDidHide(() => { });

  const getReport = () => {

    const reportFilter: ReportFilter = {
      classSchedule: classScheduleCheck,
      mentorship: mentorshipCheck,
      compGuidance: compGuidanceCheck,
      uGPGGuidance: uGPGGuidanceCheck,
      eduReform: eduReformCheck,
      monograph: monographCheck,
      paper: paperCheck,
      sciResearch: sciResearchCheck,
      startDate: startDate,
      endDate: endDate,
      teachersIn: teachersIn.map((item) => item.id),
      specifyTeacherIn: specifyTeacherIn,
    }

    report({ variables: { filter: reportFilter } });

  }

  const reset = () => {
    setClassScheduleCheck(true);
    setMentorshipCheck(true);
    setCompGuidanceCheck(true);
    setUGPGGuidanceCheck(true);
    setEduReformCheck(true);
    setMonographCheck(true);
    setPaperCheck(true);
    setSciResearchCheck(true);
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    setEndDate(new Date());
    setTeachersIn([]);
    setSpecifyTeacherIn(false);
  }

  return (
    <>
      <View className='container'>

        <View style={{
          display: 'flex', flexWrap: 'wrap', gap: '40rpx', marginTop: '30rpx',
          width: '100%', boxSizing: 'border-box', padding: '20rpx'
        }}>
          <Checkbox checked={classScheduleCheck} onChange={(e) => setClassScheduleCheck(e)} >教授课程</Checkbox>
          <Checkbox checked={mentorshipCheck} onChange={(e) => setMentorshipCheck(e)} >导师制</Checkbox>
          <Checkbox checked={compGuidanceCheck} onChange={(e) => setCompGuidanceCheck(e)} >竞赛指导</Checkbox>
          <Checkbox checked={uGPGGuidanceCheck} onChange={(e) => setUGPGGuidanceCheck(e)} >毕设指导</Checkbox>
          <Checkbox checked={eduReformCheck} onChange={(e) => setEduReformCheck(e)} >教改项目</Checkbox>
          <Checkbox checked={monographCheck} onChange={(e) => setMonographCheck(e)} >专著</Checkbox>
          <Checkbox checked={paperCheck} onChange={(e) => setPaperCheck(e)} >论文</Checkbox>
          <Checkbox checked={sciResearchCheck} onChange={(e) => setSciResearchCheck(e)} >科研项目</Checkbox>
          <Cell
            title="选择时间"
            description={`${startDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}-${endDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}，     点击选择时间范围`}
            onClick={() => setDatePickerVisible(true)}
            style={{ padding: '0' }}
          />
          <View style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '20rpx', alignItems: 'center' }}>
            <Checkbox style={{ width: '20%' }} checked={specifyTeacherIn} onChange={(e) => setSpecifyTeacherIn(e)} >选择教师</Checkbox>
            {specifyTeacherIn && <View style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '10rpx', height: '60rpx', paddingLeft: '20rpx' }}>
                {teachersIn.map((item, index) => (
                  <View key={index} style={{ display: 'flex', alignItems: 'center', gap: '5rpx', backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '30rpx', paddingLeft: '20rpx' }}>
                    <Text>{item.username}</Text>
                    <Button size='small' fill="none" onClick={() => handleDeleteTeacherIn(index)}><Close /></Button>
                  </View>
                ))}
              </View>
              <Cell
                title="选择教师"
                onClick={() => setTeachersInSelectVisible(true)}
                style={{ padding: '0', paddingLeft: '20rpx', height: '60rpx', backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '30rpx' }}
              />
            </View>
            }
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', gap: '100rpx', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Button block type="primary" style={{ marginTop: '10rpx', flex: 1 }} onClick={getReport}>
              生成报告
            </Button>
            <Button block type="default" style={{ marginTop: '10rpx', flex: 1 }} onClick={reset}>
              重置
            </Button>
          </View>
        </View>

        {data && <View style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
          <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <View style={{ flex: 1 }}>主题</View>
            <View style={{ flex: 4 }}>内容</View>
          </View>
        </View>}

        <Popup
          title="选择日期区间"
          visible={datePickerVisible}
          position="top"
          closeable
          onClose={() => setDatePickerVisible(false)}
        >
          <CalendarCard type='range'
            onChange={(d: CalendarCardValue) => { if (Array.isArray(d) && d.length === 2) { setStartDate(d[0]); setEndDate(d[1]) } }}
          />
          <div style={{ padding: '10px' }}>
            <Button block type="danger" onClick={() => setDatePickerVisible(false)}>
              确定
            </Button>
          </div>
        </Popup>


        <Popup
          title="选择系统内教师"
          visible={teachersInSelectVisible}
          position="top"
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
    </>
  )

}

export default Index;
