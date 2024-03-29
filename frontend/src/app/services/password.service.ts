import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository } from "../core/auth/auth.repository";
import { passwordQuery, passwordsQuery } from "../models/graphql/query/password.query.graphql";
import { deletePasswordMutation, updatePasswordMutation, createPasswordMutation } from "../models/graphql/mutation/password.mutation.graphql";
import { CreatePasswordResponse, NewPassword, Password, PasswordResponse, PasswordsResponse, UpdatePassword, UpdatePasswordResponse } from "../models/models/password.model";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private apollo: Apollo,
    private authRepository: AuthRepository
  ) { }

  getPasswords(): Observable<Password[] | null> {
    return this.apollo.query({
      query: passwordsQuery,
      variables: {
        userId: this.authRepository.getUserId()
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map((response: unknown) => {
        let passwords = (response as PasswordsResponse).data?.passwords;
        if (typeof passwords !== 'undefined' && passwords !== null) {
          return passwords;
        }
        return null;
      })
    );
  }

  getPassword(id: string): Observable<Password | null> {
    return this.apollo.query({
      query: passwordQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let password = (response as PasswordResponse).data?.password;
        if (typeof password !== 'undefined' && password !== null) {
          return password;
        }
        return null;
      })
    );
  }

  createPassword(newPassword: NewPassword): Observable<Password | null> {
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
    }).pipe(
      map((response: unknown) => {
        let password = (response as CreatePasswordResponse).data?.createPassword;
        if (typeof password !== 'undefined' && password !== null) {
          return password;
        }
        return null;
      })
    );
  }

  updatePassword(id: string, updatePassword: UpdatePassword): Observable<Password | null> {
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
    }).pipe(
      map((response: unknown) => {
        let password = (response as UpdatePasswordResponse).data?.updatePassword;
        if (typeof password !== 'undefined' && password !== null) {
          return password;
        }
        return null;
      })
    );
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
