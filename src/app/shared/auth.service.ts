import { BYPASS_LOG } from './authconfig.interceptor';
import { Injectable } from '@angular/core';
import { User, AuthResponse } from './auth';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpContext,
} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { __param } from 'tslib';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'https://tujia-api.herokuapp.com/api/auth';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // 'Access-Control-Allow-Origin': '*'
  });

  skip = new HttpContext().set(BYPASS_LOG, true);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  register(user: User) {
    const api = `${this.endpoint}/register`;

    return this.http
      .post<User>(api, user, { headers: this.headers, context: this.skip })
      .subscribe(() => {
        this.router.navigate(['login']);
      }, catchError(this.handleError));
  }

  login(user: User) {
    const api = `${this.endpoint}/login`;

    return this.http
      .post<AuthResponse>(api, user, {
        headers: this.headers,
        context: this.skip,
      })
      .subscribe((res: AuthResponse) => {
        this.storage.set('JWT_TOKEN', res.jwtToken);
        this.storage.set('USR_ID', res.id);
        this.storage.set('USR_NAME', res.name);

        this.router.navigate([
          'user-profile/' + res.id,
          { id: res.id, email: res.email, name: res.name },
        ]);
      }, catchError(this.handleError));
  }

  async getToken() {
    const getAuthToken: string = await this.storage.get('JWT_TOKEN');
    return getAuthToken;
  }

  async isLoggedIn(): Promise<boolean> {
    const authToken: string = await this.getToken();
    return authToken !== null ? true : false;
  }

  async logout() {
    const removeToken = await this.storage.clear().then(()=>{
      this.router.navigate(['log-in']);
    }
    );
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      console.log(error.error.message);
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status} \n Message: ${error.message}`;
      console.log(`Error Code: ${error.status} \n Message: ${error.message}`);
    }
    return throwError(msg);
  }
}
