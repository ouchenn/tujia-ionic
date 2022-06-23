import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpContextToken
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

export const BYPASS_LOG = new HttpContextToken(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.context.get(BYPASS_LOG) === true) return next.handle(req);

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {

        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
          },
        });
        
        return next.handle(req);
      })
    );
  }
}
