import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Change } from './change/change';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-login-signup',
  imports: [Login, Signup, Change, TitleCasePipe],
  templateUrl: './login-signup.html',
  styleUrl: './login-signup.scss'
})
export class LoginSignup {
  private route = inject(ActivatedRoute);
  state = signal<string>(this.route.snapshot.data['state']);
}
