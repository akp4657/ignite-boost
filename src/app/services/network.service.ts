import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { ConstantsService } from './constants.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  constructor(private http: HttpClient) {}

  /**
   * @description Fetches the access token from the constants service and adds it as auth header
   * @returns HttpHeaders
   */
  private getHttpHeaders() {
    return new HttpHeaders({
      'x-access-token': ConstantsService.getAccessToken()
    });
  }

  /**
   * @param error error object recieved from the failed http request
   * @param http_method http method
   * @param url
   * @returns error message in string
   * @description Checks if there is a message attribute in error object.
   *              If present, it returns that message. Otherwise returns a standard error message.
   *              Also logs additional request parameters when its dev mode
   */
  private getErrorMessage(error: any, http_method: string, url: string) {
    if (error.hasOwnProperty('error') && error.error.hasOwnProperty('message')) {
      return error['error']['message'];
    } else {
      if (isDevMode()) {
        console.error({
          request_url: url,
          request_headers: this.getHttpHeaders(),
          request_method: http_method,
          error: error
        });
      }
      return 'Something went wrong. Kindly contact Admin.';
    }
  }

  /**
   * @param url Endpoint URL
   * @returns HTTP GET Observable
   */
  httpGet(url: string) {
    return this.http
      .get(url, {
        headers: this.getHttpHeaders()
      })
      .pipe(
        // Catch Error Operator - To standardize the error messages which can be used to show toast
        catchError((err) => {
          throw this.getErrorMessage(err, 'GET', url);
        })
      );
  }

  /**
   * @param url Endpoint URL
   * @param post_body JSON Object with post body params
   * @returns HTTP POST Observable
   */
  httpPost(url: string, post_body: any) {
    return this.http
      .post(url, post_body, {
        headers: this.getHttpHeaders()
      })
      .pipe(
        // Catch Error Operator - To standardize the error messages which can be used to show toast
        catchError((err) => {
          throw this.getErrorMessage(err, 'POST', url);
        })
      );
  }

  /**
   * @param url Endpoint URL
   * @param put_body JSON Object with put body params
   * @returns HTTP PUT Observable
   */
  httpPut(url: string, put_body: any) {
    return this.http
      .put(url, put_body, {
        headers: this.getHttpHeaders()
      })
      .pipe(
        // Catch Error Operator - To standardize the error messages which can be used to show toast
        catchError((err) => {
          throw this.getErrorMessage(err, 'PUT', url);
        })
      );
  }

  /**
   * @param url Endpoint URL
   * @param delete_body JSON Object with delete body params
   * @returns HTTP DELETE Observable
   */
   httpDelete(url: string, delete_body: any) {
    return this.http
      .delete(url, {
        headers: this.getHttpHeaders(),
        body: delete_body
      })
      .pipe(
        // Catch Error Operator - To standardize the error messages which can be used to show toast
        catchError((err) => {
          throw this.getErrorMessage(err, 'DELETE', url);
        })
      );
  }
}