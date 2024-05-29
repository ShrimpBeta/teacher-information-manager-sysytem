import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue, FormItemRuleWithoutValidator } from "@nutui/nutui-react-taro"
import './index.scss'
import { EditMentorship } from '@/models/models/mentorship.model'
import Taro from '@tarojs/taro'
import { useLazyQuery, useMutation } from '@apollo/client'
import { updateMentorshipMutation } from '@/graphql/mutation/mentorship.mutation.graphql'
import { mentorshipQuery } from '@/graphql/query/mentorship.query.graphql'
import { getCurrentInstance } from '@tarojs/runtime'

interface InitialValuesType {
  projectName: string;
  studentNames: string;
  grade: string;
}

function Index() {

  const [mentorship] = useLazyQuery(mentorshipQuery)
  const [updateMentorship] = useMutation(updateMentorshipMutation);

  const [initialValues, setInitialValues] = useState<InitialValuesType | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [guidanceDate, setGuidanceDate] = useState<Date | null>(null)

  const [visible, setVisible] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string>('')

  const $instance = getCurrentInstance()

  useEffect(() => {
    let id = $instance.router?.params.id
    if (id) {
      mentorship({
        variables: {
          id: id
        }
      }).then((res) => {
        let mentorship = res.data.mentorship
        if (!mentorship) {
          Taro.showToast({
            title: '记录不存在',
            icon: 'none',
            duration: 2000
          });
          Taro.navigateBack()
        }
        console.log(mentorship)
        setInitialValues({
          projectName: mentorship.projectName,
          studentNames: mentorship.studentNames.join(','),
          grade: mentorship.grade
        });
        if (mentorship.guidanceDate) {
          setGuidanceDate(new Date(mentorship.guidanceDate))
        }
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
  }, [])

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
    setErrorMessages(errors)
  }

  const submitSucceed = (values: any) => {
    let { projectName, studentNames, grade } = values

    let updateMentorshipData = new EditMentorship();
    updateMentorshipData.projectName = projectName;
    updateMentorshipData.studentNames = studentNames.split(/[,，]/);
    updateMentorshipData.grade = grade;
    if (guidanceDate) {
      updateMentorshipData.guidanceDate = guidanceDate;
    }

    console.log(updateMentorshipData)

    updateMentorship({
      variables: {
        id: $instance.router?.params.id,
        mentorshipData: updateMentorshipData
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

  const dateValidator = (rule: FormItemRuleWithoutValidator, value: string) => {
    if (guidanceDate !== null) {
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
        <Form.Item label='指导日期' name='guidanceDate' validateTrigger='onBlur' rules={[{validator:dateValidator,message:'指导日期不能为空'}]}>
          <Cell
            title="选择日期"
            description={guidanceDate ? `${guidanceDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}` : '请选择'}
            onClick={() => setVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
      </Form>}
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
