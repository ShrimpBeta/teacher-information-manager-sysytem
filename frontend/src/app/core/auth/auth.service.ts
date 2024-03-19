import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthRepository, AuthUserData } from "./auth.repository";
import { Observable, map } from "rxjs";
import { signInMutation } from "../../models/graphql/mutation/user.mutation.graphql";
import { SignInResponse } from "../../models/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private apollo: Apollo,
        private authRepository: AuthRepository
    ) { }

    private saveUserData(userData: AuthUserData) {
        this.authRepository.updateToken(userData.token);
        this.authRepository.setUser(userData.user);
    }

    signIn(email: string, password: string): Observable<AuthUserData | null> {
        return this.apollo.mutate({
            mutation: signInMutation,
            variables: {
                email,
                password
            }
        })
            .pipe(
                map((response: unknown) => {
                    const sigInData = (response as SignInResponse).data?.signIn;
                    if (sigInData) {
                        this.saveUserData(sigInData);
                        return sigInData
                    }
                    return null
                })
            )
    }
}