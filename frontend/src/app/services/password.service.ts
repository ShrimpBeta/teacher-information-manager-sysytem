import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository } from "../core/auth/auth.repository";
import { passwordTrueQuery, passwordsByFilterQuery, passwordsTrueQuery } from "../models/graphql/query/password.query.graphql";
import { deletePasswordMutation, updatePasswordMutation, createPasswordMutation, uploadPasswordsMutation } from "../models/graphql/mutation/password.mutation.graphql";
import { CreatePasswordResponse, DeletePasswordResponse, EditPassword, Password, PasswordFilter, PasswordsByFilterResponse, PasswordsPage, PasswordsTrueResponse, PasswordTrue, PasswordTrueResponse, UpdatePasswordResponse, UploadPasswordsResponse } from "../models/models/password.model";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(
    private apollo: Apollo,
    private authRepository: AuthRepository
  ) { }

  getPasswordsByFilter(passwordFilter: PasswordFilter, pageIndex: number, pageSize: number): Observable<PasswordsPage | null> {
    return this.apollo.query({
      query: passwordsByFilterQuery,
      variables: {
        filter: passwordFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map((response: unknown) => {
        let passwords = (response as PasswordsByFilterResponse).data?.passwordsByFilter as PasswordsPage;
        if (typeof passwords !== 'undefined' && passwords !== null) {
          return passwords;
        }
        return null;
      })
    );
  }

  getPasswordsTrue(ids: string[]): Observable<PasswordTrue[] | null> {
    return this.apollo.query({
      query: passwordsTrueQuery,
      variables: {
        ids: ids
      }
    }).pipe(
      map((response: unknown) => {
        let passwords = (response as PasswordsTrueResponse).data?.passwordsTrue;
        if (typeof passwords !== 'undefined' && passwords !== null) {
          return passwords;
        }
        return null;
      })
    );

  }

  getPassword(id: string): Observable<PasswordTrue | null> {
    return this.apollo.query({
      query: passwordTrueQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let password = (response as PasswordTrueResponse).data?.passwordTrue;
        if (typeof password !== 'undefined' && password !== null) {
          return password;
        }
        return null;
      })
    );
  }

  createPassword(newPassword: EditPassword): Observable<Password | null> {
    return this.apollo.mutate({
      mutation: createPasswordMutation,
      variables: {
        passwordData: newPassword
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

  updatePassword(id: string, updatePassword: EditPassword): Observable<Password | null> {
    return this.apollo.mutate({
      mutation: updatePasswordMutation,
      variables: {
        id: id,
        passwordData: updatePassword
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

  deletePassword(id: string): Observable<Password | null> {
    return this.apollo.mutate({
      mutation: deletePasswordMutation,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let password = (response as DeletePasswordResponse).data?.deletePassword;
        if (typeof password !== 'undefined' && password !== null) {
          return password;
        }
        return null;
      }
      )
    );
  }

  uploadFile(file: File): Observable<EditPassword[] | null> {
    return this.apollo.mutate({
      mutation: uploadPasswordsMutation,
      context: {
        useMultipart: true
      },
      variables: {
        file: file
      }
    }).pipe(
      map((response: unknown) => {
        let passwords = (response as UploadPasswordsResponse).data?.uploadPasswords;
        if (typeof passwords !== 'undefined' && passwords !== null) {
          return passwords;
        }
        return null;
      })
    );
  }
}
