import { deleteSciResearchMutation } from '@/graphql/mutation/sciresearch.mutation.graphql';
import { sciResearchsByFilterQuery } from '@/graphql/query/sciresearch.query.graphql';
import { SciResearch, SciResearchFilter } from '@/models/models/sciResearch.model';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro';
import { Button, Empty, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { it } from 'node:test';
import { PropsWithChildren, useEffect, useState } from 'react'

const OverviewSciResearch = (props: PropsWithChildren) => {

  const [sciResearchsByFilter, { data, loading, error }] = useLazyQuery(sciResearchsByFilterQuery, {
    fetchPolicy: 'network-only'
  });
  const [deleteSciResearch] = useMutation(deleteSciResearchMutation);

  const [sciResearchList, setSciResearchList] = useState<Array<SciResearch>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getSciResearchList(index, pageSize);
  }

  const onSearch = () => {
    setPageIndex(1);
    getSciResearchList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deleteSciResearch({
      variables: {
        id: id
      }
    }).then((res) => {
      if (sciResearchList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getSciResearchList(pageIndex - 1, pageSize);
      } else {
        getSciResearchList(pageIndex, pageSize);
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

  const getSciResearchList = (pageIndex: number, pageSize: number) => {

    let sciResearchFilter = new SciResearchFilter();

    sciResearchsByFilter({
      variables: {
        filter: sciResearchFilter,
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize
      }
    });
  }

  useEffect(() => {
    getSciResearchList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getSciResearchList(pageIndex, pageSize);
  });

  useEffect(() => {
    if (data) {
      let sciResearchPage = data.sciResearchsByFilter;
      if (sciResearchPage) {
        setSciResearchList(sciResearchPage.sciResearchs);
        setTotalCount(sciResearchPage.totalCount);
      }
    }
  }, [data]);

  return (
    <View className='container'>
      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createsciresearch/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated /> :
        sciResearchList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />
        ) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {sciResearchList.map((item, index) => {
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
                    <Text>{item.title}</Text>
                    <Text>{item.number}</Text>
                    <Text>{item.teachersIn.map(teacher => teacher.username).join(',')}</Text>
                    <Text>{item.teachersOut.join(',')}</Text>
                    <Text>{item.achievement}</Text>
                    <Text>{item.isAward ? '是' : '否'}</Text>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/editsciresearch/index?id=${item.id}` }) }}>编辑</Button>
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

export default OverviewSciResearch;