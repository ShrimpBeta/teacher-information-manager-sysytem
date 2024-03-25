import { Injectable } from "@angular/core";
import { User } from "../../models/models/user.model";
import { Observable, debounceTime } from "rxjs";
import { createStore, select, setProps, withProps } from "@ngneat/elf";
import { localStorageStrategy, persistState } from "@ngneat/elf-persist-state";

// 用户登录信息
export interface AuthUserData {
  token: string,
  user: User
}


interface AuthProps {
  token: string | null;
  user: User | null;
}

// 用户登录信息持久化存储于浏览器端
@Injectable({
  providedIn: 'root'
})
export class AuthRepository {
  $user: Observable<User | null>
  private readonly authStore;

  constructor() {
    // new authStore
    this.authStore = createStore(
      { name: 'authStore' },
      withProps<AuthProps>({
        user: null,
        token: null,
      }),
    );

    // store authStore to localStorage or get authStore from localStorage
    persistState(this.authStore, {
      key: 'authStore',
      storage: localStorageStrategy,
      source: () => this.authStore.pipe(debounceTime(1000))
    });


    // Observe to user
    this.$user = this.authStore.pipe(select(state => state.user));
  }

  // 用户登录更新token
  updateToken(token: string) {
    this.authStore.update(setProps({ token: token }));
  }

  // 用户登录更新用户信息
  setUser(user: User) {
    this.authStore.update(state => ({
      ...state,
      user: user
    }));
  }

  // 获取用户id
  getUserId() {
    return this.authStore.getValue().user?.id;
  }

  getTokenVaule() {
    return this.authStore.getValue().token;
  }

  // 用户退出登录
  clear() {
    this.authStore.update(setProps({ user: null, token: null }));
  }

}
