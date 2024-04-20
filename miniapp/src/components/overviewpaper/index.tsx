import { Text, View } from '@tarojs/components';
import { useLazyQuery, useMutation } from '@apollo/client';
import Taro, { useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'

import { Button, Empty, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro';

import { deletePaperMutation } from '@/graphql/mutation/paper.mutation.graphql';
import { papersByFilterQuery } from '@/graphql/query/paper.query.graphql';
import { Paper, PaperFilter } from '@/models/models/paper.model';

import './index.scss'

const OverviewPaper = (props: PropsWithChildren) => {

  const [papersByFilter, { data, loading, error }] = useLazyQuery(papersByFilterQuery, {
    fetchPolicy: 'network-only'
  });
  const [deletePaper] = useMutation(deletePaperMutation);

  const [paperList, setPaperList] = useState<Array<Paper>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getPaperList(index, pageSize);
  }

  const onSearch = () => {
    setPageIndex(1);
    getPaperList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deletePaper({
      variables: {
        id: id
      }
    }).then((res) => {
      if (paperList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getPaperList(pageIndex - 1, pageSize);
      } else {
        getPaperList(pageIndex, pageSize);
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

  const getPaperList = (pageIndex: number, pageSize: number) => {
    let paperFilter = new PaperFilter();

    papersByFilter({
      variables: {
        filter: paperFilter,
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize
      }
    });
  }

  useEffect(() => {
    getPaperList(pageIndex, pageSize);
  }, [])

  useDidShow(() => {
    getPaperList(pageIndex, pageSize);
  })

  useEffect(() => {
    if (data) {
      let paperPage = data.papersByFilter;
      if (paperPage) {
        setPaperList(paperPage.papers);
        setTotalCount(paperPage.totalCount);
      }
    }
  }, [data]);

  return (
    <View className='container'>
      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createpaper/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated /> :
        paperList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />
        ) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {paperList.map((item, index) => {
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
                    <Text>{item.title}</Text>
                    <Text>{item.teachersIn.map(teacher => teacher.username).join(',')}</Text>
                    <Text>{item.teachersOut.join(',')}</Text>
                    <Text>{item.journalName}</Text>
                    <Text>{item.journalLevel}</Text>
                    <Text>{item.rank}</Text>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/updatepaper/index?id=${item.id}` }) }}>编辑</Button>
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

export default OverviewPaper;