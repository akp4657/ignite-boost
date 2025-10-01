import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckBreakpoints } from '../../breakpoints/check-breakpoints';
import { CharDropdown } from '../../components/char-dropdown/char-dropdown';
import { PlayableCharacters, AssistCharacters } from '../../api/video-service/Characters';
import { ReplayInfo } from '../../api/video-service/Videos';
import { DefaultVideoData, VideoData, MatchItem } from '../VideoData';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-match-info',
  imports: [
    NgClass,
    FormsModule,
    CharDropdown,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './match-info.html',
  styleUrl: './match-info.scss'
})
export class MatchInfo {
  checkBreakpoints = inject(CheckBreakpoints);

  index = input.required<number>();
  videoData = input<VideoData>(DefaultVideoData);

  time = signal<string>(''); // Assemble URL with timestamp on form submission
  player1 = signal<string>('');
  // char1 = signal<Character>(PlayableCharacters[10]);
  // assist1 = signal<Character>(AssistCharacters[0]);
  player2 = signal<string>('');
  // char2 = signal<Character>(PlayableCharacters[10]);
  // assist2 = signal<Character>(AssistCharacters[0]);

  isFull = computed<boolean>(() => this.checkBreakpoints.getIsFull());

  matchInfo = signal<ReplayInfo>({
    player1: '',
    char1: '',
    assist1: '',
    player2: '',
    char2: '',
    assist2: '',
    timestamp: this.time(),
  });

  // Disable submission unless every field is filled out
  validMatch = computed<boolean>(() => {
    const keys = Object.keys(this.matchInfo());

    for (const key of keys) {
      const newKey = key as keyof ReplayInfo;
      if (!this.matchInfo()[newKey]) return false;
    }

    return true;
  });

  updateMatchArray = output<MatchItem>();
  deleteMatchEntry = output<number>();

  playableCharacters = PlayableCharacters;
  assistCharacters = AssistCharacters;

  updateMatchInfo({key, value}: {key: keyof ReplayInfo, value: string}) {
    let parsedValue = value;

    if (key === 'timestamp') {
      this.parseTimeInput(value);
      parsedValue = this.time();
    } else if (key === 'player1') {
      this.player1.set(value);
    } else if (key === 'player2') {
      this.player2.set(value);
    }

    const temp = {...this.matchInfo()};
    temp[key] = parsedValue;
    this.matchInfo.set(temp);

    // if (key === 'timestamp') {
    //   this.parseTimeInput(value);
    //   this.matchInfo.update(match => {
    //     match['timestamp'] = this.time();
    //     return match;
    //   });
    // } else {
    //   // These inputs have two-way data-binding to remove extra whitespace
    //   if (key === 'player1') this.player1.set(value);
    //   else if (key === 'player2') this.player2.set(value);

    //   this.matchInfo.update(match => {
    //     match[key] = value;
    //     return match;
    //   });
    // }

    this.updateMatchArray.emit({data: this.matchInfo(), index: this.index(), valid: this.validMatch()});
  }

  parseTimeInput(newTime: string) {
    // Remove any invalid characters from time
    let parsedTime = '00:00:00';
    const replacedTime = newTime.replace(/[^\d:]/, '');

    if (replacedTime) {
      let splitTime = replacedTime.split(':');

      if (splitTime.length > 3) splitTime = splitTime.slice(0, 2);
      while (splitTime.length < 3) splitTime.unshift('00');

      // Ensure each measure of time is exactly 2 digits in length
      for (let i = 0; i < splitTime.length; i++) {
        while (splitTime[i].length < 2) {
          splitTime[i] = `0${splitTime[i]}`;
        }

        if (splitTime[i].length > 2) {
          splitTime[i] = splitTime[i].substring(0, 2);
        }
      }

      parsedTime = splitTime.join(':');
    }

    this.time.set(parsedTime);
  }
}
