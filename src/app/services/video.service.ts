import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';

@Injectable({
    providedIn: 'root'
  })

  export class SlackService {
    api_url = '';
  
    constructor(private networkService: NetworkService) {
      this.api_url = ConstantsService.getApiUrl();
    }
  
    getVideos() {
      return this.networkService.httpGet(this.api_url + '/getVideos');
    }

    editUser(userObj: any) {
      const body = {
        slackID: userObj.user,
        zendesk: userObj.zendesk,
        wrike: userObj.wrike,
        active: userObj.active,
        email: userObj.email
      };
      
      const url = `${this.api_url}/editUser`;
      return this.networkService.httpPut(url, body);
    }
  }