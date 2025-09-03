import { Injectable, signal } from '@angular/core';
import { User } from './User';
import { Response } from '../Response';

@Injectable({
  providedIn: 'root'
})
export class UserRequests {
  async getAuth(): Promise<boolean> {
    const req = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const res = await req.json();
    return res.auth;
  }

  async signup(newUser: User): Promise<Response> {
    const req = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    const res: Response = await req.json();

    return res;
  }

  async login(credentials: User): Promise<Response> {
    const req = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    const res: Response = await req.json();

    return res;
  }

  async logout(): Promise<Response> {
    const req = await fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const res: Response = await req.json();

    return res;
  }

  async changePassword(newCredentials: User): Promise<Response> {
    const req = await fetch('/api/passChange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCredentials)
    });
    const res: Response = await req.json();
    
    return res;
  }
}
