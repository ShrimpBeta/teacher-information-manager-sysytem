import { useEffect, PropsWithChildren, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { useDidShow, useDidHide, useLaunch } from '@tarojs/taro';

import './app.scss'
import { store, persistor } from './store'
import { createClient } from './graphql/client/client'

if (typeof queueMicrotask === 'undefined') {
  global.queueMicrotask = function (callback) {
    Promise.resolve().then(callback).catch(e => setTimeout(() => { throw e; }, 0));
  }
}

function App({ children }: PropsWithChildren<{}>) {

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);

  // 可以使用所有的 React Hooks
  useEffect(() => {
    setClient(createClient(store))
  }, [])

  // 对应 onShowmini
  useDidShow(() => { })

  // 对应 onHide
  useDidHide(() => { })

  // 对应 onLaunch
  useLaunch(() => { })

  // this.props.children 是将要会渲染的页面
  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        {
          client ? (<ApolloProvider client={client} >
            {children}
          </ApolloProvider>)
            // : children
            : null
        }
      </PersistGate>
    </Provider>
  );
}

export default App;
