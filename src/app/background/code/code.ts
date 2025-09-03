import { Component, signal, inject, ElementRef } from '@angular/core';
import { CodeFragment } from './code-fragment/code-fragment';
import { Fragments, FragmentComponent } from './code-fragment/FragmentData';

@Component({
  selector: 'app-code',
  imports: [CodeFragment],
  templateUrl: './code.html',
  styleUrl: './code.scss'
})
export class Code {
  private elementRef = inject(ElementRef);

  private maxFragments = 5;
  private spawnDelay = 1250;
  private currentIndex = 0;
  private minScale = 0.35;
  moveDistance = 75; // Pixels
  fragments = signal<FragmentComponent[]>([]);

  createFragments = setInterval(() => {
    let fragment : FragmentComponent = {
      xPos: 0,
      yPos: 0,
      scale: 0,
      fragmentId: -1,
      fragmentIndex: -1,
      travelX: false,
      moveDir: false,
    };

    this.initializeFragment(fragment); 
    fragment.fragmentIndex = this.currentIndex;
    this.fragments.update((fragments) => {
      return [...fragments, fragment];
    })
    this.currentIndex++;

    if (this.fragments().length >= this.maxFragments) {
      clearInterval(this.createFragments);
    }
  }, this.spawnDelay);

  // Once a fragment has finished animating, move it and restart
  respawnFragment(fragmentId: number) {
    const fragment = this.fragments()[fragmentId];
    this.initializeFragment(fragment);
  }

  initializeFragment(fragment: FragmentComponent) {
    const elWidth = this.elementRef.nativeElement.clientWidth;
    const elHeight = this.elementRef.nativeElement.clientHeight;

    fragment.fragmentId = Math.floor(Math.random() * Fragments.length);
    fragment.scale = (Math.random() + this.minScale);

    // Don't exceed screen
    if (elWidth < elHeight) {
      if ((Fragments[fragment.fragmentId].width * fragment.scale) > elWidth) {
        this.minScale = ((Fragments[fragment.fragmentId].width * this.minScale) > elWidth) ? 0 : this.minScale;
        fragment.scale = Math.random() 
          * ((1 - (this.moveDistance / Fragments[fragment.fragmentId].width)) - this.minScale) 
          + this.minScale;
      }
    } else {
      if((Fragments[fragment.fragmentId].height * fragment.scale) > elHeight) {
        this.minScale = ((Fragments[fragment.fragmentId].height * this.minScale) > elHeight) ? 0 : this.minScale;
        fragment.scale = Math.random() 
          * ((1 - (this.moveDistance / Fragments[fragment.fragmentId].height)) - this.minScale) 
          + this.minScale;
      }
    }
    
    
    fragment.xPos = Math.random() * (elWidth - (Fragments[fragment.fragmentId].width * fragment.scale));
    fragment.yPos = Math.random() * (elHeight - (Fragments[fragment.fragmentId].height * fragment.scale));
    fragment.travelX = (Math.random() < 0.5) ? false : true;
    
    if (fragment.travelX) {
      const fragmentWidth = Fragments[fragment.fragmentId].width * fragment.scale;
      fragment.moveDir = (elWidth / 2) > (fragment.xPos + (fragmentWidth / 2));
    } else {
      const fragmentHeight = Fragments[fragment.fragmentId].height * fragment.scale;
      fragment.moveDir = (elHeight / 2) > (fragment.yPos + (fragmentHeight / 2));
    }
  }
}
