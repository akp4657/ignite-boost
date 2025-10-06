import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Gallery } from './gallery/gallery';
import { authGuard } from './guards/auth-guard';
import { authOutGuard } from './guards/auth-out-guard';
import { secureGuard } from './guards/secure-guard';
import { UserRequests } from './api/user-service/user-requests';

export const routes: Routes = [
    {
        path: '',
        title: 'DFC Replay Database',
        component: Gallery,
    },
    
    // Lazy-loaded components.
    // https://next.angular.dev/guide/routing/define-routes#loading-route-component-strategies
    // https://angular.dev/reference/migrations/route-lazy-loading
    {
        path: 'add',
        loadComponent: () => import('./add-videos/add-videos').then(m => m.AddVideos),
        title: 'Add Videos',
        canMatch: [authGuard, secureGuard],
    },
    {
        path: 'login',
        loadComponent: () => import('./login-signup/login-signup').then(m => m.LoginSignup),
        title: 'Login',
        canMatch: [authOutGuard, secureGuard],
        data: { state: 'login' },
    },
    {
        path: 'signup',
        loadComponent: () => import('./login-signup/login-signup').then(m => m.LoginSignup),
        title: 'Signup',
        canMatch: [authOutGuard, secureGuard],
        data: { state: 'signup' },
    },
    {
        path: 'change',
        loadComponent: () => import('./login-signup/login-signup').then(m => m.LoginSignup),
        title: 'Change Password',
        canMatch: [authGuard, secureGuard],
        data: { state: 'change' },
    },
    {
        path: 'player/:name',
        component: Gallery,
        title: 'Player Gallery',
    },

    // I'm sure there's a better way to do this, but I'm lazy so this is good enough for me
    {
        path: 'logout',
        redirectTo: async () => {
            const userService = inject(UserRequests);
            await userService.logout();
            return '';
        }
    },
    {
        path: '**', 
        component: Gallery
    }
];
