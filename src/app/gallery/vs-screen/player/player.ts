import { Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { CharSelect } from './char-select/char-select';
import { AssistSelect } from "./assist-select/assist-select";
import { PlayerSearch } from "./player-search/player-search";
import { AssistCharacters, Character } from '../../../api/video-service/Characters';
import { VideoSearch } from '../../../api/video-service/Videos';


@Component({
  selector: 'app-player',
  imports: [CharSelect, NgClass, AssistSelect, PlayerSearch],
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class Player {
  isIgnition = input<boolean>(true);
  isP1 = input<boolean>(true);
  isHandset = input<boolean>(true);
  isFull = input<boolean>(true);

  assist = signal<Character>(AssistCharacters[0]);

  updateQuery = output<{ key: keyof VideoSearch; value: string | number; }>();

  updateQueryParam(key: string, value: string) {
    // Convert 'char' or 'assist' to 'char1'/'char2' and 'assist1'/'assist2' respectively
    const newKey: keyof VideoSearch = `${key}${this.isP1() ? '1' : '2'}` as keyof VideoSearch;
    //const newKey: keyof VideoSearch = this.isP1() ? 'assist1' : 'assist2';
    this.updateQuery.emit({ key: newKey, value });
  }

  updateAssistDisplay(newAssist: Character) {
    this.assist.set(newAssist);
  }
}
