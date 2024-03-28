import { useEffect, PropsWithChildren, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { useDidShow, useDidHide, useLaunch } from '@tarojs/taro'
import sr from 'sr-sdk-wxapp'

import './app.scss'
import { store, persistor } from './store'
import { createClient } from './graphql/client/client'

if (typeof queueMicrotask === 'undefined') {
  global.queueMicrotask = function (callback) {
    Promise.resolve().then(callback).catch(e => setTimeout(() => { throw e; }, 0));
  }
}


/**
   * 有数埋点SDK 默认配置
   * 使用方法请参考文档 https://mp.zhls.qq.com/youshu-docs/develop/sdk/Taro.html
   * 如对有数SDK埋点接入有任何疑问，请联系微信：sr_data_service
   */
sr.init({
  /**
   * 有数 - ka‘接入测试用’ 分配的 app_id，对应的业务接口人负责
   */
  token: 'bi6cdbda95ae2640ec',

  /**
   * 微信小程序appID，以wx开头
   */
  appid: 'touristappid',

  /**
   * 如果使用了小程序插件，需要设置为 true
   */
  usePlugin: false,

  /**
   * 开启打印调试信息， 默认 false
   */
  debug: true,

  /**
   * 建议开启-开启自动代理 Page， 默认 false
   * sdk 负责上报页面的 browse 、leave、share 等事件
   * 可以使用 sr.page 代替 Page(sr.page(options))
   * 元素事件跟踪，需要配合 autoTrack: true
   */
  proxyPage: true,
  /**
   * 建议开启-开启组件自动代理， 默认 false
   * sdk 负责上报页面的 browse 、leave、share 等事件
   */
  proxyComponent: true,
  // 建议开启-是否开启页面分享链路自动跟踪
  openSdkShareDepth: true,
  // 建议开启-元素事件跟踪，自动上报元素事件，入tap、change、longpress、confirm
  autoTrack: true,
  installFrom: 'Taro@v3'
})


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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {client ? (<ApolloProvider client={client}>
          {children}
        </ApolloProvider>)
          // : children
          : null
        }
      </PersistGate>
    </Provider>
  )
}

export default App
