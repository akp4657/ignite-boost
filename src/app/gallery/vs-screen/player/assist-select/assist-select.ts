import { Component, input, output, signal } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { Character, AssistCharacters } from '../../../../api/video-service/Characters';
import { AssistMenu } from './assist-menu/assist-menu';
import { CharDropdown } from '../../../../components/char-dropdown/char-dropdown';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assist-select',
  imports: [
    NgOptimizedImage, 
    NgClass, 
    AssistMenu,
    CharDropdown, 
    OverlayModule, 
    MatIconModule, 
  ],
  templateUrl: './assist-select.html',
  styleUrl: './assist-select.scss'
})
export class AssistSelect {
  isIgnition = input<boolean>(true);
  isP1 = input<boolean>(true); // For assist-menu text-alignment
  isFull = input<boolean>(true);
  updateAsstQuery = output<string>();
  updateAsstDisplay = output<Character>();

  selectedAsst = signal<Character>(AssistCharacters[0]); // All assists
  isOpen = signal<boolean>(false);

  assistCharacters = AssistCharacters;
  sortedAssists = [...this.assistCharacters].sort((a: Character, b: Character) => a.name.localeCompare(b.name));

  updateSelectedAssist(asst: Character) {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }

    this.selectedAsst.set(asst);
    // Null-ish coalescing multiple times because I smell.
    // This way 'Short' can be different, ie. short='Qwenthur' & internal='Quenser'
    this.updateAsstQuery.emit(asst.internal ?? asst.short ?? asst.name);

    // Handle displaying on player select options
    this.updateAsstDisplay.emit(asst);
  }
}
