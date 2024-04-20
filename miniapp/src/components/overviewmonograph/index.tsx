import { deleteMentorshipMutation } from '@/graphql/mutation/mentorship.mutation.graphql';
import { monographsByFilterQuery } from '@/graphql/query/monograph.query.graphql';
import { Monograph, MonographFilter } from '@/models/models/monograph.model';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro';
import { Button, Empty, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'

const OverviewMonograph = (props: PropsWithChildren) => {

  const [monographsByFilter, { data, loading, error }] = useLazyQuery(monographsByFilterQuery, {
    fetchPolicy: 'network-only'
  });
  const [deleteMentorship] = useMutation(deleteMentorshipMutation);

  const [monographList, setMonographList] = useState<Array<Monograph>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getMonographList(index, pageSize);
  }

  const onSearch = () => {
    setPageIndex(1);
    getMonographList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deleteMentorship({
      variables: {
        id: id
      }
    }).then((res) => {
      if (monographList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getMonographList(pageIndex - 1, pageSize);
      } else {
        getMonographList(pageIndex, pageSize);
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

  const getMonographList = (pageIndex: number, pageSize: number) => {
    let monographFilter = new MonographFilter();

    monographsByFilter({
      variables: {
        filter: monographFilter,
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize
      }
    });
  }

  useEffect(() => {
    getMonographList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getMonographList(pageIndex, pageSize);
  })

  useEffect(() => {
    if (data) {
      let monographPage = data.monographsByFilter;
      if (monographPage) {
        setMonographList(monographPage.monographs);
        setTotalCount(monographPage.totalCount);
      }
    }
  }, [data])

  return (
    <View className='container'>
      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createmonograph/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated /> :
        monographList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />
        ) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {monographList.map((item, index) => {
                return (<View
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
                  <Text>{item.teachersIn.map(teacher => teacher.username).join(',')}</Text>
                  <Text>{item.teachersOut.join(',')}</Text>
                  <Text>{item.publishLevel}</Text>
                  <Text>{item.rank}</Text>
                  <View
                    style={{
                      marginTop: '10rpx',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: '40rpx'
                    }}>
                    <Button onClick={() => { Taro.navigateTo({ url: `/pages/editmonograph/index?id=${item.id}` }) }}>编辑</Button>
                    <Button type="primary" onClick={() => onDelete(item.id)}>删除</Button>
                  </View>
                </View>)
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
        )
      }
    </View>
  );
};

export default OverviewMonograph;