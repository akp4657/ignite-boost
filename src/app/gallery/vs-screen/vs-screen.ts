import { Component, computed, inject, input, output } from '@angular/core';
import { CheckBreakpoints } from '../../breakpoints/check-breakpoints';
import { ImageLoader } from '../../components/image-loader/image-loader';
import { Player } from "./player/player";
import { VideoSearch } from '../../api/video-service/Videos';
import { VersionSelect } from "./version-select/version-select";

@Component({
  selector: 'app-vs-screen',
  imports: [ImageLoader, Player, VersionSelect],
  templateUrl: './vs-screen.html',
  styleUrl: './vs-screen.scss'
})
export class VsScreen {
  checkBreakpoints = inject(CheckBreakpoints);
  isIgnition = input<boolean>(true);
  isHandset = computed<boolean>(() => this.checkBreakpoints.getIsHandset());
  isFull = computed<boolean>(() => this.checkBreakpoints.getIsFull());

  updateQuery = output<{ key: keyof VideoSearch; value: string | number; }>();

  // TO-DO: Find some way to make changes to the query object of 'gallery'
  updateQueryParams(newQueryData: { key: keyof VideoSearch; value: string | number; }) {
    this.updateQuery.emit(newQueryData);
  }
}
