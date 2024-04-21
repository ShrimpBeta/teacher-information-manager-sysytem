import { Text, View } from '@tarojs/components';
import { useLazyQuery, useMutation } from '@apollo/client';
import Taro, { useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'

import { SearchBar, Pagination, Empty, Skeleton, Button } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro'

import { deleteAcademicTermMutation } from '@/graphql/mutation/classschedule.mutation.graphql';
import { academicTermsShortByFilterQuery } from '@/graphql/query/classschedule.query.graphql';
import { ClassSchedule, ClassScheduleFilter } from '@/models/models/classSchedule.model';

import './index.scss'

const OverviewClassSchedule = (props: PropsWithChildren) => {

  const [keyword, setKeyword] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [classScheduleList, setClassScheduleList] = useState<Array<ClassSchedule>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const [termName, setTermName] = useState<string>('');
  const [termStartDate, setTermStartDate] = useState<Date>(new Date());
  const [termWeekCount, setTermWeekCount] = useState<number>(17);
  const [createDialogVisible, setCreateDialogVisible] = useState<boolean>(false);

  const [classSchedulesByFilter, { data, loading, error }] = useLazyQuery(academicTermsShortByFilterQuery, {
    fetchPolicy: 'network-only'
  });

  const [deleteClassSchedule] = useMutation(deleteAcademicTermMutation);

  useEffect(() => {
    getClassScheduleList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getClassScheduleList(pageIndex, pageSize);
  })

  useEffect(() => {
    if (data) {
      console.log(data)
      let classSchedulePage = data.academicTermsByFilter;
      if (classSchedulePage) {
        setClassScheduleList(classSchedulePage.academicTerms);
        setTotalCount(classSchedulePage.totalCount);
      }
    }
  }, [data]);

  const getClassScheduleList = (GpageIndex, GpageSize) => {
    let classScheduleFilter = new ClassScheduleFilter();
    if (keyword !== '') {
      classScheduleFilter.termName = keyword;
    }

    classSchedulesByFilter({
      variables: {
        filter: classScheduleFilter,
        offset: (GpageIndex - 1) * GpageSize,
        limit: GpageSize
      }
    })
  }

  const onDelete = (id: string) => {
    deleteClassSchedule({
      variables: {
        termId: id
      }
    }).then((res) => {
      if (classScheduleList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getClassScheduleList(pageIndex - 1, pageSize);
      } else {
        getClassScheduleList(pageIndex, pageSize);
      }
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }).catch((err) => {
      console.log(err)
      Taro.showToast({
        title: '删除失败',
        icon: 'none',
        duration: 2000
      })
    })
  }

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getClassScheduleList(index, pageSize);
  }

  const onChange = (val: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(val)
  }

  const onSearch = () => {
    setPageIndex(1);
    getClassScheduleList(1, pageSize);
  }

  return (
    <View className='container'>

      <View style={{ marginBottom: '40rpx' }}>
        <SearchBar shape="round" onChange={onChange} onSearch={onSearch} placeholder='课程表名称' />
      </View>

      {loading ? <Skeleton rows={3} title animated /> :
        classScheduleList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {classScheduleList.map((item, index) => {
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
                    key={index}
                  >
                    <Text>课表名称: {item.termName}</Text>
                    <Text>课表开始时间: {new Date(item.startDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/editclassschedule/index?id=${item.id}` }) }}>查看</Button>
                      <Button type="primary" onClick={() => onDelete(item.id)}>删除</Button>
                    </View>
                  </View>
                )
              })}
            </View>
            <View style={{
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

export default OverviewClassSchedule;