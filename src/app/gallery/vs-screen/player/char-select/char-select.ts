import { Component, input, output, signal, computed } from '@angular/core';
import { NgOptimizedImage, NgClass, UpperCasePipe } from '@angular/common';
import { Character, PlayableCharacters } from '../../../../api/video-service/Characters';
import { CharMenu } from './char-menu/char-menu';
import { CharDropdown } from '../../../../components/char-dropdown/char-dropdown';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-char-select',
  imports: [
    NgOptimizedImage, 
    NgClass, 
    UpperCasePipe, 
    CharMenu,
    CharDropdown,
    MatIconModule, 
    OverlayModule,
  ],
  templateUrl: './char-select.html',
  styleUrl: './char-select.scss'
})
export class CharSelect {
  isIgnition = input.required<boolean>();
  isP1 = input.required<boolean>(); // For char-menu text-alignment
  isFull = input.required<boolean>();
  selectedAsst = input<Character>();
  updateCharQuery = output<string>();

  selectedChar = signal<Character>(PlayableCharacters[10]); // All characters
  isOpen = signal<boolean>(false);

  charName = computed<string>(() => this.selectedChar().short ?? this.selectedChar().name);
  asstName = computed<string>(() => (this.selectedAsst()) ? this.selectedAsst()!.short ?? this.selectedAsst()!.name : '');

  playableCharacters = PlayableCharacters;
  sortedChars = [...this.playableCharacters].sort((a: Character, b: Character) => a.name.localeCompare(b.name));

  updateSelectedChar(char: Character) {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }

    this.selectedChar.set(char);
    // Null-ish coalescing multiple times because I smell.
    // This way 'Short' can be different, ie. short='Qwenthur' & internal='Quenser'
    this.updateCharQuery.emit(char.internal ?? char.short ?? char.name);
  }
}
