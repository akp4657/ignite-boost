import { Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-player-search',
  imports: [NgClass, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './player-search.html',
  styleUrl: './player-search.scss'
})
export class PlayerSearch {
  isP1 = input<boolean>(true); // Affects skew direction
  isFull = input<boolean>(true);
  updatePlayerQuery = output<string>();

  playerInput = signal<string>('');

  updatePlayerInput(player: string) {
    this.playerInput.set(player);
    this.updatePlayerQuery.emit(player);
  }
}
