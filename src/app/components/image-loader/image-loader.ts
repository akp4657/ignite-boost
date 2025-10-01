import { Component, computed, input, signal } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-image-loader',
  imports: [NgOptimizedImage, NgClass, MatProgressSpinnerModule],
  templateUrl: './image-loader.html',
  styleUrl: './image-loader.scss'
})
export class ImageLoader {
  src = input.required<string>();
  width = input.required<number>();
  height = input.required<number>();
  alt = input.required<string>();
  priority = input<boolean>(false);
  addClass = input<string>('');
  spinnerClass = input<string>('');

  taller = computed<boolean>(() => this.width() < this.height());

  loaded = signal<boolean>(false);
}
