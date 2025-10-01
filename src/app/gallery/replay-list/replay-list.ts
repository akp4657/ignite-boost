import { Component, computed, input, output, signal } from '@angular/core';
import { ReplayInfo } from './replay-info/replay-info';
import { Video, VideoSearch } from '../../api/video-service/Videos';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-replay-list',
  imports: [ReplayInfo, MatPaginatorModule],
  templateUrl: './replay-list.html',
  styleUrl: './replay-list.scss'
})
export class ReplayList {
  replays = input<Video[]>();
  sortType = signal<boolean>(true); // True is newest, false is oldest
  updateSortQuery = output<{key: keyof VideoSearch, value: string | number}>();

  pageSize = 25; // Default page size
  pageEvent = signal<PageEvent>({
    length: this.replays()?.length ?? 0,
    pageIndex: 0,
    pageSize: this.pageSize,
  });

  displayedReplays = computed<Video[]>(() => {
    if ((this.replays()?.length ?? 0) === 0) return [];

    const startIndex = this.pageEvent().pageIndex * this.pageEvent().pageSize;
    const endIndex = (this.pageEvent().pageIndex + 1) * this.pageEvent().pageSize;
    return this.replays()!.slice(startIndex, endIndex);
  });

  updateSort() {
    this.updateSortQuery.emit({ key: 'version', value: (this.sortType()) ? 'Newest' : 'Oldest'});
  }

  updateDisplay(newEvent: PageEvent) {
    this.pageEvent.set(newEvent);
  }
}
