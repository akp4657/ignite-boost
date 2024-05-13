import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NetworkService } from './network.service';

// Defining session storage constants
const ACCESS_TOKEN = "x-access-token";
const USERS = "users";

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  constructor(private networkService: NetworkService) {}

  static readonly IMG_X = "assets/images/icons/x.svg";

  static getApiUrl() {
    return environment.api_url;
  }

  //#region middleware-auth-token
  // These are the functions which will be used to manage access token
  // This access token will be used in each of the http request headers
  static setAccessToken(access_token: string) {
    sessionStorage.setItem(ACCESS_TOKEN, access_token);
  }

  static setUserData(users: any) {
    sessionStorage.setItem(USERS, JSON.stringify(users))
  }

  static getUserData() {
    const user_str = sessionStorage.getItem(USERS);
    console.log(user_str)
    if (user_str) {
      const user_json: any = JSON.parse(user_str);
      return user_json;
    } else {
      return null;
    }
  }

  static getAccessToken() {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    return token === null ? '' : token;
  }
}
