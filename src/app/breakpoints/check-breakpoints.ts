import { Injectable, inject, signal } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class CheckBreakpoints {
  private breakpointObserver = inject(BreakpointObserver);
  private isHandset = signal(false);
  private isFull = signal(false);

  constructor() {
    // For mobile viewports
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      '(max-width: 1067.98px)',
    ]).subscribe(result => {
      this.isHandset.set(result.matches);
    });

    // For full viewports (>=1280px)
    this.breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      this.isFull.set(result.matches);
    });
  }

  getIsHandset() {
    return this.isHandset();
  }

  getIsFull() {
    return this.isFull();
  }
}
