import { Text, View } from '@tarojs/components';
import { useLazyQuery, useMutation } from '@apollo/client';
import Taro,{ useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'


import { Button, Empty, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro';

import { deleteUGPGGuidanceMutation } from '@/graphql/mutation/ugpgguidance.mutation.graphql';
import { uGPGGuidancesByFilterQuery } from '@/graphql/query/ugpgguidance.query.graphql';
import { UGPGGuidance, UGPGGuidanceFilter } from '@/models/models/uGPGGuidance.model';

import './index.scss'

const OverviewUGPGGuidance = (props: PropsWithChildren) => {

  const [uGPGGuidancesByFilter, { data, loading, error }] = useLazyQuery(uGPGGuidancesByFilterQuery, {
    fetchPolicy: 'network-only'
  });
  const [deleteUGPGGuidance] = useMutation(deleteUGPGGuidanceMutation);

  const [uGPGGuidanceList, setUGPGGuidanceList] = useState<Array<UGPGGuidance>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getUGPGGuidanceList(index, pageSize);
  }

  const onSearch = () => {
    setPageIndex(1);
    getUGPGGuidanceList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deleteUGPGGuidance({
      variables: {
        id: id
      }
    }).then((res) => {
      if (uGPGGuidanceList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getUGPGGuidanceList(pageIndex - 1, pageSize);
      } else {
        getUGPGGuidanceList(pageIndex, pageSize);
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

  const getUGPGGuidanceList = (pageIndex: number, pageSize: number) => {
    let uGPGGuidanceFilter = new UGPGGuidanceFilter();

    uGPGGuidancesByFilter({
      variables: {
        filter: uGPGGuidanceFilter,
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize
      }
    });
  }

  useEffect(() => {
    getUGPGGuidanceList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getUGPGGuidanceList(pageIndex, pageSize);
  })

  useEffect(() => {
    if (data) {
      let uGPGGuidancePage = data.uGPGGuidancesByFilter;
      if (uGPGGuidancePage) {
        setUGPGGuidanceList(uGPGGuidancePage.uGPGGuidances);
        setTotalCount(uGPGGuidancePage.totalCount);
      }
    }
  }, [data])

  return (
    <View className='container'>
      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createugpgguidance/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated /> :
        uGPGGuidanceList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />
        ) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {uGPGGuidanceList.map((item, index) => {
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
                    <Text>{item.studentName}</Text>
                    <Text>{item.thesisTopic}</Text>
                    <Text>{item.defenseResult}</Text>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/updateugpgguidance/index?id=${item.id}` }) }}>编辑</Button>
                      <Button type="primary" onClick={() => onDelete(item.id)}>删除</Button>
                    </View>
                  </View>
                )
              })
              }
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
        )}
    </View>
  );
};

export default OverviewUGPGGuidance;