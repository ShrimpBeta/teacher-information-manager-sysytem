import { Injectable } from "@angular/core";
import { User } from "../../models/models/user.model";
import { Observable, debounceTime } from "rxjs";
import { createStore, select, setProps, withProps } from "@ngneat/elf";
import { localStorageStrategy, persistState } from "@ngneat/elf-persist-state";
import { JWT } from "./jwt";


export interface AuthUserData {
    token: string,
    user: User
}

interface AuthProps {
    token: string | null;
    user: User | null;
}


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

    // update info when signIn
    updateToken(token: string) {
        this.authStore.update(setProps({ token: token }));
    }

    setUser(user: User) {
        this.authStore.update(state => ({
            ...state,
            user: user
        }));
    }

    
    getTokenVaule() {
        return this.authStore.getValue().token;
    }

    isLoggedInValue() {
        return this.authStore.pipe(select(state => !!state.token));
    }

    isLoggedIn(): boolean {
        try {
            const token = this.getTokenVaule();
            if (token) {
                return !!JWT.decodeToken(token);
            }
            return false
        } catch (error) {
            return false;
        }
    }

    clear() {
        this.authStore.update(setProps({ user: null, token: null }));
    }

}