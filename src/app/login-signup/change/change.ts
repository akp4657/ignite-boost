import { Component, OnInit, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { matchPasswordValidator } from '../match-password.directive';
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
  selector: 'app-change',
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './change.html',
  styleUrl: './change.scss',
})
export class Change implements OnInit {
  meta = inject(Meta);
  titleService = inject(Title);
  snackBar = inject(MatSnackBar);
  userService = inject(UserRequests);
  router = inject(Router);

  reqPending = signal<boolean>(false);

  form = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      new: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(24),
      ]),
      retype: new FormControl('', [Validators.required]),
    },
    { validators: matchPasswordValidator(true) }
  );

  async handleSubmit() {
    this.reqPending.set(true);

    const data: User = {
      username: this.form.controls.username.value?.trim() ?? '',
      password: this.form.controls.password.value?.trim() ?? '',
      new: this.form.controls.new.value?.trim() ?? '',
      retype: this.form.controls.retype.value?.trim() ?? '',
    };

    const res: Response = await this.userService.changePassword(data);
    this.reqPending.set(false);

    if (res.error) {
      this.snackBar.open(res.error, 'Dismiss');
    } else if (res.redirect) {
      this.router.navigateByUrl(res.redirect);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ignite Boost - Change Password');
    this.meta.addTag({
      name: 'title',
      content: 'Ignite Boost - Change Password',
    });
    this.meta.addTag({
      name: 'description',
      content:
        'A form for users to fill out in order to change the password to their Ignite Boost account.',
    });
  }
}
