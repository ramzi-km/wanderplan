import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, catchError, tap, throwError } from 'rxjs';
import * as adminActions from '../admin/store/admin/admin.actions';
import { ErrorEventService } from '../services/error-event.service';
import * as userActions from '../store/user/user.actions';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private router: Router,
    private errorEventService: ErrorEventService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    //Excluding Mapbox requests being interrupted

    const isMapboxRequest = request.url.includes('api.mapbox.com');
    if (isMapboxRequest) {
      return next.handle(request);
    }
    //Modifying requests

    let modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const isAdminRequest = request.url.includes('api/admin');
    if (isAdminRequest) {
      return next.handle(modifiedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage: string = error.error.message;

          if (error.status === 401) {
            this.store.dispatch(adminActions.adminLogout());
          } else if (error.status === 403 || error.status === 404) {
            console.log(errorMessage);
          } else {
            this.errorEventService.triggerError(errorMessage);
          }
          return throwError(errorMessage);
        }),
      );
    }
    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string = error.error.message;

        if (error.status === 401) {
          this.store.dispatch(userActions.userLogout());
        } else if (error.status === 403 || error.status === 404) {
          console.log(errorMessage);
        } else {
          this.errorEventService.triggerError(errorMessage);
        }
        return throwError(errorMessage);
      }),
    );
  }
}
