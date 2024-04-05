import { gql } from "apollo-angular";

export const passwordsByFilterQuery = gql`
  query passwordsByFilter($filter: PasswordFilter!) {
    passwordsByFilter(filter: $filter) {
      id
      url
      appName
      account
      description
      updatedAt
      createdAt
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
