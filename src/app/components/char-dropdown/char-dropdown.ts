import { Component, computed, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { Character, DefaultChar } from '../../api/video-service/Characters';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { ImageLoader } from '../image-loader/image-loader';

@Component({
  selector: 'app-char-dropdown',
  imports: [
    NgClass,
    OverlayModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    ImageLoader
],
  templateUrl: './char-dropdown.html',
  styleUrl: './char-dropdown.scss'
})
export class CharDropdown {
  enableDefault = input<boolean>(true);
  isIgnition = input<boolean>(true);
  enableInfo = input<boolean>(true);
  imageDir = input.required<string>();
  characters = input.required<Character[]>(); // Playable or Assist
  imgWidth = input.required<number>();
  imgHeight = input.required<number>();

  defaultChar = DefaultChar;

  selectedChar = signal<Character>(this.defaultChar);
  isOpen = signal<boolean>(false);

  // Sorts A-Z
  sortedChars = computed<Character[]>(() => [...this.characters()].sort((a: Character, b: Character) => a.name.localeCompare(b.name)));

  updateCharQuery = output<Character>();

  updateSelectedChar(char: Character) {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }

    this.selectedChar.set(char);
    this.updateCharQuery.emit(char);
  }
}
