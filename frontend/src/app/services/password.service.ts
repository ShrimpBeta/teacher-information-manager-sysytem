import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository } from "../core/auth/auth.repository";
import { passwordQuery, passwordsQuery } from "../models/graphql/query/password.query.graphql";
import { deletePasswordMutation, updatePasswordMutation, createPasswordMutation } from "../models/graphql/mutation/password.mutation.graphql";
import { NewPassword, UpdatePassword } from "../models/models/password.model";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private apollo: Apollo,
    private authRepository: AuthRepository
  ) { }

  getPasswords() {
    return this.apollo.query({
      query: passwordsQuery,
      variables: {
        userId: this.authRepository.getUserId()
      }
    })
  }

  getPassword(id: string) {
    return this.apollo.query({
      query: passwordQuery,
      variables: {
        userId: this.authRepository.getUserId(),
        passwordId: id
      }
    })
  }

  createPassword(newPassword: NewPassword) {
    return this.apollo.mutate({
      mutation: createPasswordMutation,
      variables: {
        userId: this.authRepository.getUserId(),
        passwordData: {
          url: newPassword.url,
          appName: newPassword.appName,
          account: newPassword.account,
          password: newPassword.password,
          description: newPassword.description
        }
      }
    })
  }

  updatePassword(id: string, updatePassword: UpdatePassword) {
    return this.apollo.mutate({
      mutation: updatePasswordMutation,
      variables: {
        id: id,
        passwordData: {
          url: updatePassword.url,
          appName: updatePassword.appName,
          account: updatePassword.account,
          password: updatePassword.password,
          description: updatePassword.description
        }
      }
    })
  }

  deletePassword(id: string) {
    return this.apollo.mutate({
      mutation: deletePasswordMutation,
      variables: {
        id: id
      }
    })
  }
}
