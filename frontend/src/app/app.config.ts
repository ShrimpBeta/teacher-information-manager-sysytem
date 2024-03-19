import { ApplicationConfig } from '@angular/core';
import { Router, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { graphqlProvider } from './graphql.provider';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './core/auth/auth.service';
import { AuthRepository } from './core/auth/auth.repository';
import { TokenInterceptor } from './core/auth/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: Document, useExisting: DOCUMENT },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, deps: [Router, AuthService, AuthRepository, DOCUMENT] },
    graphqlProvider
  ]
};
