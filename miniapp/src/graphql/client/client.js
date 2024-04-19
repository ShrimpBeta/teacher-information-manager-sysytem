import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client"
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import Taro from "@tarojs/taro";
import qs from "qs";
import { JWT } from "@/auth/jwt";

const httpUrl = 'http://localhost:8080/graphql'
const ENDPOINT = 'http://localhost:8080'

export const request = async (
  url,
  body,
  { method = "GET", paramas, headers } = {}
) => {
  if (body && paramas) {
    url = `${url}?${qs.stringify(paramas)}`;
  }
  console.log('headers', headers);
  return await Taro.request({
    url: `${url.startsWith('http') ? "" : ENDPOINT}${url}`,
    method: method,
    data: body,
    dataType: "json",
    header: headers,
  });
};

const httpLink = new HttpLink({
  uri: httpUrl,
  fetch: (url, options) => {
    const { method = "POST", headers, body } = options;
    return request(url, body, {
      method,
      headers
    }).then(res => {
      let { data, statusCode, header } = res;
      res.text = () => Promise.resolve(JSON.stringify(data));
      res.statusCode = statusCode;
      res.header = header;
      return res;
    });
  }
});

const uploadLink = createUploadLink({
  uri: httpUrl,
  fetch: (url, options) => {
    const { method = "POST", headers, body } = options;
    return request(url, body, {
      method,
      headers
    }).then(res => {
      console.log('res', res);
      let { data, statusCode, header } = res;
      res.text = () => Promise.resolve(JSON.stringify(data));
      res.statusCode = statusCode;
      res.header = header
      return res;
    });
  }
});

export const createClient = (store) => {

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext((context) => {
      let headers = context.headers || {}
      let token = store.getState().userData.token;
      if (JWT.getTokenExpiration(token)) {
        store.dispatch({ type: 'userData/logout' })
        token = null;
      }
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
        graphQLErrors.map(({ message, locations, path }) => {
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    authMiddleware,
    // httpLink
    uploadLink
  ]);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link
  });

  return client;
}
