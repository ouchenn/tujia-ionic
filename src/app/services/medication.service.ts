import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medication } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  endpoint: string = 'https://tujia-api.herokuapp.com/api/medication';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(private http: HttpClient) {}

  getAll(): Observable<Medication[]> {
    const api = `${this.endpoint}/all`;
    return this.http.get<Medication[]>(api, { headers: this.headers });
  }
}
