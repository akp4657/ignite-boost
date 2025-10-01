import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { CheckBreakpoints } from '../breakpoints/check-breakpoints';
import { Navlist } from "./navlist/navlist";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgClass,
    Navlist,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  checkBreakpoints = inject(CheckBreakpoints);
  mobileMenuOpen = signal<boolean>(false);
}
