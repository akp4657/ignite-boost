import { Component, OnInit, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserRequests } from '../../api/user-service/user-requests';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../api/user-service/User';
import { Response } from '../../api/Response';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  meta = inject(Meta);
  titleService = inject(Title);
  userService = inject(UserRequests);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  reqPending = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  async handleSubmit() {
    this.reqPending.set(true);

    const data: User = {
      username: this.form.controls.username.value?.trim() ?? '',
      password: this.form.controls.password.value?.trim() ?? '',
    };
    const res: Response = await this.userService.login(data);
    this.reqPending.set(false);

    if (res.error) {
      this.snackBar.open(res.error, 'Dismiss');
    } else if (res.redirect) {
      this.router.navigateByUrl(res.redirect);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ignite Boost - Login');
    this.meta.addTag({ name: 'title', content: 'Ignite Boost - Login' });
    this.meta.addTag({
      name: 'description',
      content: 'A form allowing users to login to their Ignite Boost account.',
    });
  }
}
