import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Form, Input, Cell, Popup, CalendarCard, type CalendarCardValue } from "@nutui/nutui-react-taro"
import './index.scss'
import Taro from '@tarojs/taro'
import { useMutation } from '@apollo/client'
import { createUGPGGuidanceMutation } from '@/graphql/mutation/ugpgguidance.mutation.graphql'
import { EditUGPGGuidance } from '@/models/models/uGPGGuidance.model'

function Index() {

  const [createUGPGGuidance] = useMutation(createUGPGGuidanceMutation);

  const [openingCheckDate, setOpeningCheckDate] = useState<Date | null>(null)
  const [midtermCheckDate, setMidtermCheckDate] = useState<Date | null>(null)
  const [defenseDate, setDefenseDate] = useState<Date | null>(null)

  const [openingCheckVisible, setOpeningCheckVisible] = useState(false)
  const [midtermCheckVisible, setMidtermCheckVisible] = useState(false)
  const [defenseVisible, setDefenseVisible] = useState(false)

  const submitFailed = (error: any) => {
    let errors = JSON.stringify(error)
  }

  const submitSucceed = (values: any) => {
    let { thesisTopic, studentName, openingCheckResult, midtermCheckResult, defenseResult } = values

    let createUGPGGuidanceData = new EditUGPGGuidance();
    createUGPGGuidanceData.thesisTopic = thesisTopic;
    createUGPGGuidanceData.studentName = studentName;
    createUGPGGuidanceData.openingCheckResult = openingCheckResult;
    createUGPGGuidanceData.midtermCheckResult = midtermCheckResult;
    createUGPGGuidanceData.defenseResult = defenseResult;

    if (openingCheckDate) {
      createUGPGGuidanceData.openingCheckDate = openingCheckDate;
    }

    if (midtermCheckDate) {
      createUGPGGuidanceData.midtermCheckDate = midtermCheckDate;
    }

    if (defenseDate) {
      createUGPGGuidanceData.defenseDate = defenseDate;
    }

    console.log(createUGPGGuidanceData)

    createUGPGGuidance({
      variables: {
        uGPGGuidanceData: createUGPGGuidanceData
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
            <Button formType='reset' style={{ marginLeft: '20px' }}
              onClick={() => {
                setOpeningCheckDate(null);
                setMidtermCheckDate(null);
                setDefenseDate(null)
              }}>
              重置
            </Button>
          </div>
        }
      >
        <Form.Item label='毕设主题' name='thesisTopic' validateTrigger='onBlur' rules={[{ required: true, message: '项目名不能为空' }]} >
          <Input placeholder='请输入毕设主题' type='text' />
        </Form.Item>
        <Form.Item label='学生姓名' name='studentName' validateTrigger='onBlur' rules={[{ required: true, message: '学生姓名不能为空' }]}>
          <Input placeholder='请输入学生姓名' type='text' />
        </Form.Item>
        <Form.Item label='开题检查结果' name='openingCheckResult' validateTrigger='onBlur'>
          <Input placeholder='请输入开题检查结果' type='text' />
        </Form.Item>
        <Form.Item label='开题检查时间' name='openingCheckDate' validateTrigger='onBlur'>
          <Cell
            title="选择日期"
            description={openingCheckDate ? `${openingCheckDate}` : '请选择'}
            onClick={() => setOpeningCheckVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
        <Form.Item label='中期检查结果' name='midtermCheckResult' validateTrigger='onBlur'>
          <Input placeholder='请输入中期检查结果' type='text' />
        </Form.Item>
        <Form.Item label='中期检查时间' name='midtermCheckDate' validateTrigger='onBlur'>
          <Cell
            title="选择日期"
            description={midtermCheckDate ? `${midtermCheckDate}` : '请选择'}
            onClick={() => setMidtermCheckVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
        <Form.Item label='最终答辩结果' name='defenseResult' validateTrigger='onBlur'>
          <Input placeholder='请输入最终答辩结果' type='text' />
        </Form.Item>
        <Form.Item label='最终答辩时间' name='defenseDate' validateTrigger='onBlur'>
          <Cell
            title="选择日期"
            description={defenseDate ? `${defenseDate}` : '请选择'}
            onClick={() => setDefenseVisible(true)}
            style={{ padding: '0' }}
          />
        </Form.Item>
      </Form>

      <Popup
        title="选择日期"
        visible={openingCheckVisible}
        position="bottom"
        closeable
        onClose={() => setOpeningCheckVisible(false)}
      >
        <CalendarCard
          onChange={(d: CalendarCardValue) => setOpeningCheckDate(d as Date)}
        />
        <div style={{ padding: '10px' }}>
          <Button block type="danger" onClick={() => setOpeningCheckVisible(false)}>
            确定
          </Button>
        </div>
      </Popup>

      <Popup
        title="选择日期"
        visible={midtermCheckVisible}
        position="bottom"
        closeable
        onClose={() => setMidtermCheckVisible(false)}
      >
        <CalendarCard
          onChange={(d: CalendarCardValue) => setMidtermCheckDate(d as Date)}
        />
        <div style={{ padding: '10px' }}>
          <Button block type="danger" onClick={() => setMidtermCheckVisible(false)}>
            确定
          </Button>
        </div>
      </Popup>

      <Popup
        title="选择日期"
        visible={defenseVisible}
        position="bottom"
        closeable
        onClose={() => setDefenseVisible(false)}
      >
        <CalendarCard
          onChange={(d: CalendarCardValue) => setDefenseDate(d as Date)}
        />
        <div style={{ padding: '10px' }}>
          <Button block type="danger" onClick={() => setDefenseVisible(false)}>
            确定
          </Button>
        </div>
      </Popup>
    </View >
  )
}

export default Index
