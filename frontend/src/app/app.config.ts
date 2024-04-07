import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { Router, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { graphqlProvider } from './graphql.provider';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './core/auth/auth.service';
import { AuthRepository } from './core/auth/auth.repository';
import { TokenInterceptor } from './core/auth/token.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: Document, useExisting: DOCUMENT },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, deps: [Router, AuthService, AuthRepository, DOCUMENT] },
    graphqlProvider,
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }
  ]
};
