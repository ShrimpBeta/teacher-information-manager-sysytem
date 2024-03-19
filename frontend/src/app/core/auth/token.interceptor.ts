import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { Observable, catchError, map, throwError } from "rxjs";
import { JWT } from "./jwt";

export class TokenInterceptor implements HttpInterceptor {
    window: Window;

    constructor(
        private router: Router,
        private authService: AuthService,
        private authRespository: AuthRepository,
        private document: Document
    ) {
        this.window = this.document.defaultView as Window
    }

    // add header Authorization
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headers = { Authorization: '' };
        const token = this.authRespository.getTokenVaule();
        if (token) {
            const isTokenExpired = this.getTokenExpiration(token);

            if (isTokenExpired) {
                this.navigateToLogout();
                return throwError(() => new Error());
            } else {
                headers['Authorization'] = `${token}`
            }
        }
        return this.sendRequest(req, next, headers)

    }

    getTokenExpiration(token: string) {
        const tokenValue = JWT.decodeToken(token)
        const isTokenExpired = Date.now() >= (tokenValue?.exp ?? 0) * 1000
        return isTokenExpired
    }

    // send request with Authorization
    sendRequest(
        req: HttpRequest<unknown>,
        next: HttpHandler,
        headers: { Authorization: string }
    ) {
        const newRequest = req.clone({ setHeaders: headers });
        return next.handle(newRequest).pipe(
            map(response => {
                this.checkUnAuthorizedError(response);
                return response;
            }),
            catchError(error => {
                throw new Error(error);
            })
        )
    }

    // Response Authorized
    checkUnAuthorizedError(response: unknown) {
        if (response instanceof HttpResponse) {
            const bodyErrors = response.body.errors;
            if (bodyErrors?.length) {
                const unAuthorizeErrorFounded = bodyErrors.find(
                    (bodyErrors: { code: number }) => bodyErrors.code === 401
                );
                if (unAuthorizeErrorFounded) {
                    this.navigateToLogout();
                }
            }
        }
    }

    navigateToLogout() {
        this.router.navigate(['/signout'], {
            queryParams: {
                origin: encodeURIComponent(this.window.location.href),
                message: "token expired"
            }
        })
    }
}

