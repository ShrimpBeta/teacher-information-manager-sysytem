import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client"
import { onError } from "@apollo/client/link/error";
import Taro from "@tarojs/taro";
import qs from "qs";
// import qs from "querystringify";

const httpUrl = 'http://localhost:8080/query'
const ENDPOINT = 'http://localhost:8080'

export const request = async (
  url,
  body,
  { method = "GET", paramas = {}, header = {} } = {}
) => {
  if (body && paramas) {
    url = `${url}?${qs.stringify(paramas)}`;
  }
  return await Taro.request({
    url: `${url.startsWith('http') ? "" : ENDPOINT}${url}`,
    method: method as 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
    data: body,
    dataType: "json",
    header: header,
  });
};

const httpLink = new HttpLink({
  uri: httpUrl,
  fetch: (url, options) => {
    const { method = "POST", header, body } = options;
    return request(url, body, {
      method,
      header
    }).then(res => {
      let response = new Response(JSON.stringify(res.data), {
        status: res.statusCode,
        headers: res.header
      });
      response.text = () => Promise.resolve(JSON.stringify(res.data))
      return response;
    });
  }
});


// const authMiddleware = new ApolloLink((operation, forward) => {
//   operation.setContext((context) => {
//     let headers = context.headers || {}
//     const token = localStorage.getItem('token')
//     return {
//       headers: {
//         ...headers,
//         'Authorization': token ? `Bearer ${token}` : ''
//       }
//     }
//   })
//   return forward(operation)
// });


// const link = ApolloLink.from([
//   onError(({ graphQLErrors, networkError }) => {
//     if (graphQLErrors) {
//       graphQLErrors.map(({ message, locations, path }) =>
//         console.log(
//           `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//         )
//       );
//     }
//     if (networkError)
//       console.log(`[Network error]: ${networkError}`);
//   }),
//   authMiddleware,
//   httpLink
// ]);

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: link
// });

// export default client;

export const createClient = (store) => {
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext((context) => {
      let headers = context.headers || {}
      const token = store.getState().user.token
      return {
        headers: {
          ...headers,
          'Authorization': token ? `Bearer ${token}` : ''
        }
      }
    })
    return forward(operation)
  })

  const link = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError)
        console.log(`[Network error]: ${networkError}`);
    }),
    authMiddleware,
    httpLink
  ]);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link
  });

  return client;
}
