import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue } from "@nutui/nutui-react-taro"
import './index.scss'
import { EditMentorship } from '@/models/models/mentorship.model'
import Taro from '@tarojs/taro'
import { useMutation } from '@apollo/client'
import { createMentorshipMutation } from '@/graphql/mutation/mentorship.mutation.graphql'

function Index() {

  const [createMentorship] = useMutation(createMentorshipMutation);

  const [guidanceDate, setGuidanceDate] = useState<Date | null>(null)

  const [visible, setVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string>('')

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
  }

  const submitSucceed = (values: any) => {
    let { projectName, studentNames, grade } = values

    let createMentorshipData = new EditMentorship();
    createMentorshipData.projectName = projectName;
    createMentorshipData.studentNames = studentNames.split(/[,，]/);
    createMentorshipData.grade = grade;
    if (guidanceDate) {
      createMentorshipData.guidanceDate = guidanceDate;
    }

    console.log(createMentorshipData)

    createMentorship({
      variables: {
        mentorshipData: createMentorshipData
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
            <Button formType='reset' style={{ marginLeft: '20px' }} onClick={() => setGuidanceDate(null)}>
              重置
            </Button>
          </div>
        }
      >
        <Form.Item label='项目名称' name='projectName' validateTrigger='onBlur' rules={[{ required: true, message: '项目名不能为空' }]} >
          <Input placeholder='请输入项目名称' type='text' />
        </Form.Item>
        <Form.Item label='学生姓名' name='studentNames' validateTrigger='onBlur' rules={[{ required: true, message: '学生姓名不能为空' }]}>
          <Input placeholder='请输入学生姓名，多个以 "," "，" 隔开 ' type='text' />
        </Form.Item>
        <Form.Item label='项目成绩' name='grade' validateTrigger='onBlur'>
          <Input placeholder='请输入项目成绩' type='text' />
        </Form.Item>
        <Form.Item label='指导时间' name='guidanceDate' validateTrigger='onBlur'>
          <Cell
            title="选择日期"
            description={guidanceDate ? `${guidanceDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}` : '请选择'}
            onClick={() => setVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
      </Form>
      <Popup
        title="选择日期"
        visible={visible}
        position="bottom"
        closeable
        onClose={() => setVisible(false)}
      >
        <CalendarCard
          onChange={(d: CalendarCardValue) => setGuidanceDate(d as Date)}
        />
        <div style={{ padding: '10px' }}>
          <Button block type="danger" onClick={() => setVisible(false)}>
            确定
          </Button>
        </div>
      </Popup>
    </View>
  )
}

export default Index
