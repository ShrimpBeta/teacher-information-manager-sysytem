import { Text, View } from '@tarojs/components';
import { useLazyQuery, useMutation } from '@apollo/client';
import Taro, { useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'

import { SearchBar, Pagination, Empty, Skeleton, Button } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Plus } from '@nutui/icons-react-taro'

import { deletePasswordMutation } from '@/graphql/mutation/password.mutation.graphql';
import { passwordsByFilterQuery } from '@/graphql/query/password.query.graphql';
import { Password, PasswordFilter } from '@/models/models/password.model';

import './index.scss'

const OverviewPassword = (props: PropsWithChildren) => {

  const [passwordsByFilter, { data, loading, error }] = useLazyQuery(passwordsByFilterQuery, {
    fetchPolicy: 'network-only'
  })
  const [deletePassword] = useMutation(deletePasswordMutation);

  useEffect(() => {
    getPasswordList(pageIndex, pageSize);
  }, []);

  useDidShow(() => {
    getPasswordList(pageIndex, pageSize);
  });

  useEffect(() => {
    if (data) {
      console.log(data)
      let passwordPage = data.passwordsByFilter;
      if (passwordPage) {
        setPasswordList(passwordPage.passwords);
        setTotalCount(passwordPage.totalCount);
      }
    }
  }, [data]);

  const [keyword, setKeyword] = useState<string>('');

  const [passwordList, setPasswordList] = useState<Array<Password>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (index: number) => {
    setPageIndex(index);
    getPasswordList(index, pageSize);
  }

  const onChange = (val: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(val)
  }

  const onSearch = () => {
    console.log(keyword)
    setPageIndex(1);
    getPasswordList(1, pageSize);
  }

  const onDelete = (id: string) => {
    deletePassword({
      variables: {
        id: id
      }
    }).then((res) => {
      // console.log(res)
      if (passwordList.length === 1 && pageIndex > 1) {
        setPageIndex(pageIndex - 1);
        getPasswordList(pageIndex - 1, pageSize);
      } else {
        getPasswordList(pageIndex, pageSize);
      }
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      });
    }
    ).catch((err) => {
      console.log(err)
    });
  }

  const getPasswordList = (GpageIndex: number, GpageSize: number) => {
    let passwordFilter = new PasswordFilter();
    if (keyword !== '') {
      passwordFilter.appName = keyword;
      passwordFilter.url = keyword;
      passwordFilter.account = keyword;
    }
    console.log(passwordFilter);

    passwordsByFilter({
      variables: {
        filter: passwordFilter,
        offset: (GpageIndex - 1) * GpageSize,
        limit: GpageSize
      }
    });
  }

  return (
    <View className='container' style={{ height: 'calc(100vh - 92px - 120rpx)', position: 'relative' }}>
      <SearchBar shape="round" onChange={onChange} onSearch={onSearch} placeholder='appName、url、account' />
      <Button block type="primary" style={{ marginTop: '40rpx', marginBottom: '40rpx' }}
        onClick={() => { Taro.navigateTo({ url: '/pages/createpassword/index' }) }}>
        <Plus style={{ marginRight: '20rpx' }} />
        添加
      </Button>
      {loading ? <Skeleton rows={3} title animated /> :
        passwordList.length === 0 ? (
          <Empty description="无数据" style={{ marginTop: '10px' }} />) : (
          <View>
            <View style={{ height: '650rpx', overflow: 'auto' }}>
              {passwordList.map((item, index) => {
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
                    <Text>应用名称: {item.appName}</Text>
                    <Text>网站: {item.url}</Text>
                    <Text>账号: {item.account}</Text>
                    <View
                      style={{
                        marginTop: '10rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '40rpx'
                      }}>
                      <Button onClick={() => { Taro.navigateTo({ url: `/pages/editpassword/index?id=${item.id}` }) }}>编辑</Button>
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

export default OverviewPassword;