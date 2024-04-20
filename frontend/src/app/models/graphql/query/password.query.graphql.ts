import { gql } from "apollo-angular";

export const passwordsByFilterQuery = gql`
  query passwordsByFilter($filter: PasswordFilter!,$offset:Int!, $limit:Int!) {
    passwordsByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      passwords{
        id
        url
        appName
        account
        description
        updatedAt
        createdAt
      }
    }
  }
`

export const passwordTrueQuery = gql`
  query passwordTrue($id: ID!) {
    passwordTrue(id: $id) {
      id
      url
      appName
      account
      password
      description
      updatedAt
      createdAt
    }
  }
`

export const passwordsTrueQuery = gql`
  query passwordsTrue($ids: [ID!]!) {
    passwordsTrue(ids: $ids) {
      id
      url
      appName
      account
      password
      description
      updatedAt
      createdAt
    }
  }
`
