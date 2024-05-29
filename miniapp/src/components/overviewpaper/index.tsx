import { Text, View } from '@tarojs/components';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Taro, { useDidShow } from '@tarojs/taro';
import { PropsWithChildren, useEffect, useState } from 'react'

import { Button, Empty, Input, Pagination, Skeleton } from '@nutui/nutui-react-taro';
import { ArrowLeft, ArrowRight, Close, Plus } from '@nutui/icons-react-taro';

import { deletePaperMutation } from '@/graphql/mutation/paper.mutation.graphql';
import { papersByFilterQuery } from '@/graphql/query/paper.query.graphql';
import { Paper, PaperFilter } from '@/models/models/paper.model';

import './index.scss'
import { userExportsQuery } from '@/graphql/query/user.query.graphql';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/slices/reducers';
import { UserExport } from '@/models/models/user.model';

const OverviewPaper = (props: PropsWithChildren) => {

  const user = useSelector((state: RootState) => state.userData.user);

  const [papersByFilter, { data, loading, error }] = useLazyQuery(papersByFilterQuery, {
    fetchPolicy: 'network-only'
  });

  const { data: UsersData } = useQuery(userExportsQuery, { fetchPolicy: 'network-only' });

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

    if (paperName !== '') {
      paperFilter.title = paperName;
    }

    if (teachersIn.length > 0) {
      paperFilter.teachersIn = teachersIn.map(item => item.id);
    }

    if (teachersOut.length > 0) {
      paperFilter.teachersOut = teachersOut;
    }

    papersByFilter({
      variables: {
        filter: paperFilter,
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize
      }
    });
  }

  const [paperName, setPaperName] = useState<string>('');
  const [teachersIn, setTeachersIn] = useState<UserExport[]>([]);
  const [teachersOut, setTeachersOut] = useState<string[]>([]);
  const [newTeacherOut, setNewTeacherOut] = useState<string>('');
  const [users, setUsers] = useState<UserExport[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleDeleteTeacherOut = (index: number) => {
    const newTeachersOut = [...teachersOut];
    newTeachersOut.splice(index, 1);
    setTeachersOut(newTeachersOut);
  }

  const handleAddTeacherOut = () => {
    if (newTeacherOut === '') {
      return;
    }
    const newTeachersOut = [...teachersOut, newTeacherOut];
    setTeachersOut(newTeachersOut);
    setNewTeacherOut('');
  }

  const handleAddTeacherIn = (index: number) => {
    let isExist = teachersIn.some((item) => item.id === users[index].id);
    if (isExist) {
      setShowDropdown(false);
      return;
    }
    const newTeachersIn = [...teachersIn, users[index]];
    setTeachersIn(newTeachersIn);
    setShowDropdown(false);
  }

  const handleDeleteTeacherIn = (index: number) => {
    const newTeachersIn = [...teachersIn];
    newTeachersIn.splice(index, 1);
    setTeachersIn(newTeachersIn);
  }

  const onClear = () => {
    setPaperName('');
    setTeachersIn([]);
    setTeachersOut([]);
    setNewTeacherOut('');
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

  useEffect(() => {
    if (UsersData) {
      let userExports = UsersData.userExports;
      if (userExports) {
        const userExportsFilter = userExports.filter((item: UserExport) => {
          return item.id !== user?.id;
        });
        console.log(userExportsFilter);
        setUsers(userExportsFilter);
      }
    }
  }, [UsersData]);

  return (
    <View className='container'>

      <View style={{ display: 'flex', flexDirection: 'column', gap: '20rpx' }}>
        <Input placeholder="请输入论文题目" value={paperName} onChange={(v) => setPaperName(v)} style={{ backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '40rpx', paddingTop: '8rpx', paddingBottom: '8rpx' }} />
        <View style={{ display: 'flex', alignItems: 'center', gap: '10rpx', height: '40rpx', paddingLeft: '20rpx' }}>
          <Text>系统内教师:</Text>
          {teachersIn.map((item, index) => (
            <View key={index} style={{ display: 'flex', alignItems: 'center', gap: '5rpx', backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '30rpx', paddingLeft: '20rpx' }}>
              <Text>{item.username}</Text>
              <Button size='small' fill="none" onClick={() => handleDeleteTeacherIn(index)}><Close /></Button>
            </View>
          ))}
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20rpx', position: 'relative' }}>
          <Button block onClick={() => setShowDropdown(true)}>选择教师</Button>
          {showDropdown && (
            <View style={{ position: 'absolute', height: '350rpx', top: '60rpx', left: '0', right: '0', backgroundColor: '#f6f6f6', zIndex: '1000', overflow: 'auto', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', borderRadius: '30rpx', padding: '30rpx' }}>
              {users.map((item, index) => (
                <View key={index} style={{ width: '100%', paddingLeft: '20rpx', display: 'flex', flexDirection: 'row', gap: '40rpx', border: '1px dotted #ccc' }} onClick={() => handleAddTeacherIn(index)}>
                  <Text>{item.username}</Text>
                  <Text>{item.email}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={{ display: 'flex', alignItems: 'center', gap: '10rpx', height: '40rpx', paddingLeft: '20rpx' }}>
          <Text>系统外教师:</Text>
          {teachersOut.map((item, index) => (
            <View key={index} style={{ display: 'flex', alignItems: 'center', gap: '5rpx', backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '30rpx', paddingLeft: '20rpx' }}>
              <Text>{item}</Text>
              <Button size='small' fill="none" onClick={() => handleDeleteTeacherOut(index)}><Close /></Button>
            </View>
          ))}
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20rpx' }}>
          <Input placeholder="请输入教师名称" value={newTeacherOut} onChange={(v) => setNewTeacherOut(v)} style={{ backgroundColor: '#f6f6f6', border: '1px solid #ccc', borderRadius: '40rpx', paddingTop: '8rpx', paddingBottom: '8rpx' }} />
          <Button size='small' onClick={handleAddTeacherOut}>添加</Button>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50rpx' }}>
          <Button type="primary" onClick={onSearch}>搜索</Button>
          <Button onClick={onClear}>清空</Button>
        </View>
      </View>

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
                    <Text>论文题目: {item.title}</Text>
                    <Text>系统内教师: {item.teachersIn.map(teacher => teacher.username).join(',')}</Text>
                    <Text>系统外教师: {item.teachersOut?.join(',')}</Text>
                    <Text>发表日期: {new Date(item.publishDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    <Text>期刊名称: {item.journalName}</Text>
                    <Text>期刊级别: {item.journalLevel}</Text>
                    <Text>排名: {item.rank}</Text>
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