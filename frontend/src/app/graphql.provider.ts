import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
// @ts-ignore
import extractFiles from 'extract-files/extractFiles.mjs';
// @ts-ignore
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { setContext } from '@apollo/client/link/context';
import { AuthRepository } from './core/auth/auth.repository';

const uri = 'http://127.0.0.1:8080/query'; // <-- add the URL of the GraphQL server here
export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);
  return {
    link: ApolloLink.from([
      setContext((operation, prevContext) => {
        return {
          headers: {
            ...prevContext['headers'],
          }
        }
      }),
      httpLink.create({
        uri,
        extractFiles: (body) => extractFiles(body, isExtractableFile) as any,
      })
    ]),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
];
