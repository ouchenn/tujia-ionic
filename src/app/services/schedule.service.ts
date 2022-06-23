import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from '../shared/interfaces';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  endpoint: string = 'https://tujia-api.herokuapp.com/api/schedule';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(private http: HttpClient) { }

  save(schedule){
    const api = `${this.endpoint}`;

    return this.http
      .post<any>(api, schedule, {
        headers: this.headers,
      })
      .subscribe((res: Schedule) => {
      }, catchError(this.handleError));
  }

  getAll(): Observable<Schedule[]> {
    const api = `${this.endpoint}/all`;
    return this.http.get<Schedule[]>(api, { headers: this.headers });
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
