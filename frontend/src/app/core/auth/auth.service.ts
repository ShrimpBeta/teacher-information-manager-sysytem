import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository, AuthUserData } from "./auth.repository";
import { Observable, map } from "rxjs";
import { signInMutation } from "../../models/graphql/mutation/user.mutation.graphql";
import { SignInResponse } from "../../models/models/user.model";

// 用户登录服务
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apollo: Apollo,
    private authRepository: AuthRepository
  ) { }

  // 保存用户登录信息
  private saveUserData(userData: AuthUserData) {
    this.authRepository.updateToken(userData.token);
    this.authRepository.setUser(userData.user);
  }

  // 用户登录
  signIn(email: string, password: string): Observable<AuthUserData | null> {
    return this.apollo.mutate({
      mutation: signInMutation,
      variables: {
        signInData: {
          email,
          password
        }
      }
    })
      .pipe(
        map((response: unknown) => {
          let sigInData = (response as SignInResponse).data?.signIn;
          if (sigInData) {
            this.saveUserData(sigInData);
            return sigInData
          }
          return null
        })
      );
  }

  // 用户登出
  signOut() {
    this.authRepository.clear();
  }
}
