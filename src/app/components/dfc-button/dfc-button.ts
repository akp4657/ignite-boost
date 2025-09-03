import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dfc-button',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './dfc-button.html',
  styleUrl: './dfc-button.scss'
})
export class DfcButton {
  // Optional function run when pressed. Creates <button> element
  // Or routerLink run when pressed. Creates <a> element
  callback = input<Function>();
  routerURL = input<string>();
  disabled = input<boolean>(false);
}
