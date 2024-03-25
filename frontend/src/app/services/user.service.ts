import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository } from "../core/auth/auth.repository";
import { activateUserMutation, updateUserMutation, updateUserPasswordMutation } from "../models/graphql/mutation/user.mutation.graphql";
import { ActivateUser, ActivateUserResponse, UpdateUser, UpdateUserPassword, UpdateUserPasswordResponse, UpdateUserResponse, User } from "../models/models/user.model";
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
      let success = (response as UpdateUserPasswordResponse).data?.updateAccountPassword.boolean;
      if (typeof success === 'boolean') {
        return success;
      }
      return null;
    })
    );
  }

  removeWechatAuth() {

  }

  deleteUser() {

  }
}
