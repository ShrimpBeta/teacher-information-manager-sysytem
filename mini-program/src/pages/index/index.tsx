import { PropsWithChildren, useEffect, useState } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import { gql, useMutation } from '@apollo/client'
import { RootState } from '../../store/slices/reducers'
import { userSlice } from '../../store/slices/userSlice'
import { signInMutation } from '../../graphql/mutation/user.mutation.graphql'
import './index.scss'


const Index = (props: PropsWithChildren) => {
  useEffect(() => { });

  useDidShow(() => { });

  useDidHide(() => { });

  // const user = useSelector((state: RootState) => state.userData.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const [signIn] = useMutation(signInMutation);

  const handleSignIn = () => {
    console.log(email);
    console.log(password);

    signIn({
      variables: {
        email: email,
        password: password
      }
    }).then((res) => {
      let { token, user } = res.data.signIn;
      console.log(token);
      console.log(user);
      dispatch(userSlice.actions.login({ token, user }));
    });
  }

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      {/* <Text>{user}</Text> */}
      <Input value={email} onInput={(e) => setEmail(e.detail.value)} placeholder='Email' />
      <Input value={password} onInput={(e) => setPassword(e.detail.value)} placeholder='Password' />
      <Button onClick={() => handleSignIn()}>Sign In</Button>

    </View>
  )

}

export default Index;
