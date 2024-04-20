import { Text, View } from '@tarojs/components';
import { useLazyQuery, useMutation } from '@apollo/client';
import Taro, { useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'

import { Button, Empty, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro';

import { deleteEduReformMutation } from '@/graphql/mutation/edureform.mutation.graphql';
import { eduReformsByFilterQuery } from '@/graphql/query/edureform.query.graphql';
import { EduReform, EduReformFilter } from '@/models/models/eduReform.model';

import './index.scss'

const OverviewEduReform = (props: PropsWithChildren) => {

  const [eduReformsByFilter, { data, loading, error }] = useLazyQuery(eduReformsByFilterQuery, {
    fetchPolicy: 'network-only'
  });

  const [deleteEduReform] = useMutation(deleteEduReformMutation);

  const [eduReformList, setEduReformList] = useState<Array<EduReform>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getEduReformList(index, pageSize);
  }

  const onSearch = () => {
    setPageIndex(1);
    getEduReformList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deleteEduReform({
      variables: {
        id: id
      }
    }).then((res) => {
      if (eduReformList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getEduReformList(pageIndex - 1, pageSize);
      } else {
        getEduReformList(pageIndex, pageSize);
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

  const getEduReformList = (pageIndex: number, pageSize: number) => {
    let eduReformFilter = new EduReformFilter();

    eduReformsByFilter({
      variables: {
        filter: eduReformFilter,
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize
      }
    });
  }

  useEffect(() => {
    getEduReformList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getEduReformList(pageIndex, pageSize);
  });

  useEffect(() => {
    if (data) {
      let eduReformPage = data.eduReformsByFilter
      if (eduReformPage) {
        setEduReformList(eduReformPage.eduReforms);
        setTotalCount(eduReformPage.totalCount);
      }
    }
  }, [data]);

  return (
    <View className='container'>

      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createedureform/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>

      {loading ? <Skeleton rows={3} title animated /> :
        eduReformList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>{
              eduReformList.map((item, index) => {
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
                    <View className='title'>{item.title}</View>
                    <View className='content'>
                      <Text>项目编号: {item.number}</Text>
                      {/* <Text>开始时间：{item.startDate}</Text> */}
                      <Text>持续时间: {item.duration}</Text>
                      <Text>级别: {item.level}</Text>
                      <Text>等级: {item.rank}</Text>
                      <Text>成就: {item.achievement}</Text>
                      <Text>资金: {item.fund}</Text>
                    </View>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/updateedureform/index?id=${item.id}` }) }}>编辑</Button>
                      <Button type="primary" onClick={() => onDelete(item.id)}>删除</Button>
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
                total={totalCount}
                pageSize={pageSize}
                value={pageIndex}
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

export default OverviewEduReform;