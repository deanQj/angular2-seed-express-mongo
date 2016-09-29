import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Config } from '../index';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class UsersService {

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(): Observable<string[]> {
    return this.http.get(`${Config.API}/api/users`)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  post(body: any): Observable<string[]> {
    return this.http.post(`${Config.API}/api/users`, body)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  put(body: any): Observable<string[]> {
    return this.http.put(`${Config.API}/api/users`, body)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  delete(id: any): Observable<string[]> {
    return this.http.delete(`${Config.API}/api/users/${id}`)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }


  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

