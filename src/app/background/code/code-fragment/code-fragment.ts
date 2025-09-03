import { Component, input, output, signal, computed } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Fragment, Fragments } from './FragmentData';

@Component({
  selector: 'app-code-fragment',
  imports: [ NgStyle ],
  templateUrl: './code-fragment.html',
  styleUrl: './code-fragment.scss'
})
export class CodeFragment {
  xPos = input<number>(0);
  yPos = input<number>(0);
  scale = input<number>(0);
  fragmentId = input<number>(0);
  fragmentIndex = input<number>(0);
  travelX = input<boolean>(true);
  moveDir = input<boolean>(true);
  moveDistance = input<number>(0);
  
  private moveDuration = 1000;
  private movePerFrame = computed(() => this.moveDistance() / (60 * (this.moveDuration / 1000))); // 60FPS
  opacity = 15;

  finishedMovement = output<number>();

  // Always moves towards center
  // True is right/up, false is left/down
  fragment = computed<Fragment>(() => Fragments[this.fragmentId()]);
  totalMoveAmt = signal<number>(0);
  visible = signal<boolean>(false);

  updatePosition = setInterval(() => {
    const newAmt = Math.abs(this.totalMoveAmt()) + this.movePerFrame();

    if (this.visible() && newAmt >= this.moveDistance()) {
      this.visible.set(false);
      setTimeout(() => {
        //clearInterval(this.updatePosition);
        this.finishedMovement.emit(this.fragmentIndex());
        this.totalMoveAmt.set(0);
      }, 100);
    } else if (!this.visible() && newAmt < this.moveDistance()) {
      this.visible.set(true);
    }

    this.totalMoveAmt.set(newAmt * (this.moveDir() ? 1 : -1));
  }, 1000 / 60);
}
