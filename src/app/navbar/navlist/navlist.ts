import { Component, computed, inject, input, resource } from '@angular/core';
import { NgClass } from '@angular/common';
import { Event, Router, RouterLink, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarOption } from '../navbar-option';
import { DfcButton } from '../../components/dfc-button/dfc-button';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { UserRequests } from '../../api/user-service/user-requests';

@Component({
  selector: 'app-navlist',
  imports: [
    NgClass, 
    RouterLink,
    DfcButton, 
    MatListModule,
    MatButtonModule, 
    MatMenuModule, 
    MatExpansionModule,
    MatIconModule
  ],
  templateUrl: './navlist.html',
  styleUrl: './navlist.scss'
})
export class Navlist {
  private userResource = inject(UserRequests);
  private readonly router = inject(Router);

  isMobile = input<boolean>(false);

  authResource = resource({
    loader: () => this.userResource.getAuth()
  });

  // Navbar options, adjusts based on login state
  options = computed<NavbarOption[]>(() => {
    const list = [];

    list.push({
      text: 'Replays',
      id: 1,
      url: { path: '/' },
    });
    
    list.push({
      text: 'Resources',
      id: 2,
      children: [
        {
          text: 'DFC Resource Site',
          id: 1,
          url: { path: 'https://sites.google.com/view/dfci-guide/', external: true},
        },
        {
          text: 'DFCI Mizuumi Wiki',
          id: 2,
          url: { path: 'https://wiki.gbl.gg/w/Dengeki_Bunko:_Fighting_Climax/DFCI', external: true },
        },
        {
          text: 'Report an issue',
          id: 3,
          url: { path: 'mailto:ignite-boost.net@gmail.com', external: true},
        }
      ],
      elementType: 'dropdown',
    });

    // Check if logged in
    if (this.authResource.hasValue() && this.authResource.value()) {
      list.push({
        text: 'Add Replays',
        id: 3,
        url: { path: '/add' }
      });

      list.push({
        text: 'Change Password',
        id: 4,
        url: { path: '/change'}
      });

      list.push({
        text: 'Logout',
        id: 5,
        url: { path: '/logout' },
        elementType: 'dfc-button'
      });
    } else {
      list.push({
        text: 'Login to Add Replays',
        id: 3,
        url: { path: '/login'}
      });

      list.push({
        text: 'Signup',
        id: 4,
        url: { path: '/signup' },
        elementType: 'dfc-button'
      });
    }

    return list;
  });

  constructor() {
    // Subscribe to router events and react to events
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Navigation completed
        this.authResource.reload();
      }
    });
  }
}