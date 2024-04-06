import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository } from "../core/auth/auth.repository";
import { activateUserMutation, deleteUserMutation, fetchCodeMutation, removeWechatAuthMutation, resetUserPasswordMutation, updateUserMutation, updateUserPasswordMutation } from "../models/graphql/mutation/user.mutation.graphql";
import { ActivateUser, ActivateUserResponse, DeleteAccountResponse, FetchCodeResponse, RemoveWechatAuthResponse, ResetUserPassword, ResetUserPasswordResponse, UpdateUser, UpdateUserPassword, UpdateUserPasswordResponse, UpdateUserResponse, User } from "../models/models/user.model";
import { map, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private apollo: Apollo,
    private authRepository: AuthRepository
  ) { }

  activateUser(activateData: ActivateUser): Observable<User | null> {
    return this.apollo.mutate({
      mutation: activateUserMutation,
      variables: {
        userId: this.authRepository.getUserId(),
        userData: {
          username: activateData.username,
          avatar: activateData.avatar,
          phoneNumber: activateData.phoneNumber,
          password: activateData.password
        }
      },
      context: {
        useMultipart: true
      }
    }).pipe(
      map((response: unknown) => {
        let user = (response as ActivateUserResponse).data?.activateUser;
        if (user) {
          this.authRepository.setUser(user);
          return user;
        }
        return null;
      })
    );
  }

  updateUser(userData: UpdateUser): Observable<User | null> {
    return this.apollo.mutate({
      mutation: updateUserMutation,
      context: {
        useMultipart: true
      },
      variables: {
        userId: this.authRepository.getUserId(),
        userData: {
          username: userData.username,
          avatar: userData.avatar,
          phoneNumber: userData.phoneNumber
        }
      }
    })
      .pipe(
        map((response: unknown) => {
          let user = (response as UpdateUserResponse).data?.updateUser;
          if (user) {
            this.authRepository.setUser(user);
            return user;
          }
          return null;
        })
      );
  }

  updateUserPassword(updateUserPassword: UpdateUserPassword): Observable<boolean | null> {
    return this.apollo.mutate({
      mutation: updateUserPasswordMutation,
      variables: {
        userId: this.authRepository.getUserId(),
        passwordData: {
          oldPassword: updateUserPassword.oldPassword,
          newPassword: updateUserPassword.newPassword
        }
      }
    }).pipe(map((response: unknown) => {
      let success = (response as UpdateUserPasswordResponse).data?.updateAccountPassword;
      if (typeof success === 'boolean') {
        return success;
      }
      return null;
    })
    );
  }

  fetchCode(email: string): Observable<boolean | null> {
    return this.apollo.mutate({
      mutation: fetchCodeMutation,
      variables: {
        email: email
      }
    }).pipe(map((response: unknown) => {
      let success = (response as FetchCodeResponse).data?.generateResetPasswordCode;
      if (typeof success === 'boolean') {
        return success;
      }
      return null;
    })
    );
  }

  resetUserPassword(resetUserPassword: ResetUserPassword): Observable<boolean | null> {
    return this.apollo.mutate({
      mutation: resetUserPasswordMutation,
      variables: {
        resetPasswordData: {
          email: resetUserPassword.email,
          newPassword: resetUserPassword.password,
          code: resetUserPassword.code
        }
      }
    }).pipe(map((response: unknown) => {
      let success = (response as ResetUserPasswordResponse).data?.resetAccountPassword;
      if (typeof success === 'boolean') {
        return success;
      }
      return null;
    })
    );

  }

  removeWechatAuth(userId: string): Observable<boolean | null> {
    return this.apollo.mutate({
      mutation: removeWechatAuthMutation,
      variables: {
        userId: userId
      }
    }).pipe(map((response: unknown) => {
      let success = (response as RemoveWechatAuthResponse).data?.removeWechatAuth;
      if (typeof success === 'boolean') {
        return success;
      }
      return null;
    })
    );
  }

  deleteUser(userId: string): Observable<boolean | null> {
    return this.apollo.mutate({
      mutation: deleteUserMutation,
      variables: {
        userId: userId
      }
    }).pipe(map((response: unknown) => {
      let success = (response as DeleteAccountResponse).data?.deleteAccount;
      if (typeof success === 'boolean') {
        return success;
      }
      return null;
    })
    );
  }
}
