import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useLazyQuery, useMutation } from '@apollo/client';
import { PropsWithChildren, useEffect, useState } from 'react'

import { Button, Empty, Pagination, Skeleton, Input } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus, Close } from '@nutui/icons-react-taro';

import { mentorshipsByFilterQuery } from '@/graphql/query/mentorship.query.graphql';
import { deleteMentorshipMutation } from '@/graphql/mutation/mentorship.mutation.graphql';
import { Mentorship, MentorshipFilter } from '@/models/models/mentorship.model';

import './index.scss'

const OverviewMentorship = (props: PropsWithChildren) => {

  const [mentorshipsByFilter, { data, loading, error }] = useLazyQuery(mentorshipsByFilterQuery, {
    fetchPolicy: 'network-only'
  })
  const [deleteMentorship] = useMutation(deleteMentorshipMutation);

  const [mentorshipList, setMentorshipList] = useState<Array<Mentorship>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getMentorshipList(index, pageSize);
  }

  const onSearch = () => {
    setPageIndex(1);
    getMentorshipList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deleteMentorship({
      variables: {
        id: id
      }
    }).then((res) => {
      if (mentorshipList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getMentorshipList(pageIndex - 1, pageSize);
      } else {
        getMentorshipList(pageIndex, pageSize);
      }
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      });
    }).catch((err) => {
      console.log(err);
      Taro.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 2000
      });
    });
  }

  const getMentorshipList = (GpageIndex: number, GpageSize: number) => {
    let mentorshipFilter = new MentorshipFilter();

    if (projectName !== '') {
      mentorshipFilter.projectName = projectName;
    }
    if (studentNames.length > 0) {
      mentorshipFilter.studentNames = studentNames;
    }

    mentorshipsByFilter({
      variables: {
        filter: mentorshipFilter,
        offset: (GpageIndex - 1) * GpageSize,
        limit: GpageSize
      }
    })
  }

  const [projectName, setProjectName] = useState<string>('');
  const [studentNames, setStudentNames] = useState<string[]>([]);
  const [newStudentName, setNewStudentName] = useState<string>('');

  const handleDeleteStudentName = (index: number) => {
    const newStudentNames = [...studentNames];
    newStudentNames.splice(index, 1);
    setStudentNames(newStudentNames);
  }

  const handleAddStudentName = () => {
    if (newStudentName === '') {
      return;
    }
    const newStudentNames = [...studentNames, newStudentName];
    setStudentNames(newStudentNames);
    setNewStudentName('');
  }

  const onClear = () => {
    setProjectName('');
    setStudentNames([]);
    setNewStudentName('');
  }

  useEffect(() => {
    getMentorshipList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getMentorshipList(pageIndex, pageSize);
  })

  useEffect(() => {
    if (data) {
      let mentorshipPage = data.mentorshipsByFilter;
      if (mentorshipPage) {
        setMentorshipList(mentorshipPage.mentorships);
        setTotalCount(mentorshipPage.totalCount);
      }
    }
  }, [data])


  return (
    <View className='container'>

      <View style={{ display: 'flex', flexDirection: 'column', gap: '20rpx' }}>
        <Input placeholder="请输入项目名称" value={projectName} onChange={(v) => setProjectName(v)} style={{ backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '40rpx', paddingTop: '8rpx', paddingBottom: '8rpx' }} />
        <View style={{ display: 'flex', alignItems: 'center', gap: '10rpx', height: '40rpx', paddingLeft: '20rpx' }}>
          <Text>学生名称:</Text>
          {studentNames.map((item, index) => (
            <View key={index} style={{ display: 'flex', alignItems: 'center', gap: '5rpx', backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '30rpx', paddingLeft: '20rpx' }}>
              <Text>{item}</Text>
              <Button size='small' fill="none" onClick={() => handleDeleteStudentName(index)}><Close /></Button>
            </View>
          ))}
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20rpx' }}>
          <Input placeholder="请输入学生名称" value={newStudentName} onChange={(v) => setNewStudentName(v)} style={{ backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '40rpx', paddingTop: '8rpx', paddingBottom: '8rpx' }} />
          <Button size='small' onClick={handleAddStudentName}>添加</Button>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50rpx' }}>
          <Button type="primary" onClick={onSearch}>搜索</Button>
          <Button onClick={onClear}>清空</Button>
        </View>
      </View>

      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/creatementorship/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated /> :
        mentorshipList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {mentorshipList.map((item, index) => {
                return (
                  <View
                    style={{
                      padding: '20rpx',
                      border: '1px solid #e8e8e8',
                      borderRadius: '10rpx',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10rpx',
                      marginTop: index === 0 ? '0' : '20rpx'
                    }}
                    key={index}>
                    <View>
                      <Text>项目名称: {item.projectName}</Text>
                    </View>
                    <View>
                      <Text>学生名称: {item.studentNames.join(',')}</Text>
                    </View>
                    <View>
                      <Text>指导日期: {new Date(item.guidanceDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </View>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/updatementorship/index?id=${item.id}` }) }}>编辑</Button>
                      <Button type='primary' size='small' onClick={() => { onDelete(item.id) }}>删除</Button>
                    </View>
                  </View>
                )
              })}
            </View>
            <View
              style={{
                marginTop: '20rpx',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <Pagination
                value={pageIndex}
                total={totalCount}
                pageSize={pageSize}
                onChange={onPageChange}
                prev={<ArrowLeft />}
                next={<ArrowRight />}
              />
            </View>
          </View>
        )
      }
    </View>
  );
};

export default OverviewMentorship;