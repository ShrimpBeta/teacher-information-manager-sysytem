import { Text, View } from '@tarojs/components';
import { PropsWithChildren, useEffect, useState } from 'react'

import './index.scss'
import { useDidShow } from '@tarojs/taro';
import { useLazyQuery, useMutation } from '@apollo/client';
import { compGuidancesByFilterQuery } from '@/graphql/query/compguidance.query.graphql';
import { deleteCompGuidanceMutation } from '@/graphql/mutation/compguidance.mutation.graphql';
import { CompGuidance, CompGuidanceFilter } from '@/models/models/compGuidance.model';
import Taro from '@tarojs/taro';
import { Button, Empty, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro';

const OverviewCompGuidance = (props: PropsWithChildren) => {


  const [compGuidancesByFilter, { data, loading, error }] = useLazyQuery(compGuidancesByFilterQuery, {
    fetchPolicy: 'network-only'
  })
  const [deleteCompGuidance] = useMutation(deleteCompGuidanceMutation)

  const [compGuidanceList, setCompGuidanceList] = useState<Array<CompGuidance>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getCompGuidanceList(index, pageSize);
  }

  const onSearch = () => {

    setPageIndex(1);
    getCompGuidanceList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deleteCompGuidance({
      variables: {
        id: id
      }
    }).then((res) => {
      if (compGuidanceList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getCompGuidanceList(pageIndex - 1, pageSize);
      } else {
        getCompGuidanceList(pageIndex, pageSize);
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

  const getCompGuidanceList = (GpageIndex: number, GpageSize: number) => {
    let compGuidanceFilter = new CompGuidanceFilter();

    compGuidancesByFilter({
      variables: {
        filter: compGuidanceFilter,
        offset: (GpageIndex - 1) * GpageSize,
        limit: GpageSize
      }
    })
  }

  useEffect(() => {
    getCompGuidanceList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getCompGuidanceList(pageIndex, pageSize);
  });

  useEffect(() => {
    if (data) {
      console.log(data)
      let compGuidancePage = data.compGuidancesByFilter;
      if (compGuidancePage) {
        setCompGuidanceList(compGuidancePage.compGuidances);
        setTotalCount(compGuidancePage.totalCount);
      }
    }
  }, [data]);

  return (
    <View className='container'>
      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createcompguidance/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated avatar /> :
        compGuidanceList.length === 0 ? (<Empty description="无数据" style={{ marginTop: '10px' }} />) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {
                compGuidanceList.map((item, index) => {
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
                      }} key={index}>
                      <Text> 项目名称: {item.projectName}</Text>
                      <Text>学生名称: {item.studentNames.join(',')}</Text>
                      <Text>竞赛分数: {item.competitionScore}</Text>
                      <Text>获奖情况: {item.awardStatus}</Text>
                      <View
                        style={{
                          marginTop: '10rpx',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: '40rpx'
                        }}>
                        <Button onClick={() => { Taro.navigateTo({ url: `/pages/editcompguidance/index?id=${item.id}` }) }}>编辑</Button>
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

export default OverviewCompGuidance;