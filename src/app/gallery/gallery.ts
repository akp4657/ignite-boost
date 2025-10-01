import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { VsScreen } from './vs-screen/vs-screen';
import { ReplayList } from './replay-list/replay-list';
import { VideoSearch } from '../api/video-service/Videos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoRequests } from '../api/video-service/video-requests';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-gallery',
  imports: [VsScreen, ReplayList, MatProgressSpinnerModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit, OnDestroy {
  meta = inject(Meta);
  titleService = inject(Title);
  videoRequestService = inject(VideoRequests);
  snackBar = inject(MatSnackBar);

  // What we need inside Gallery
  // - Query signal that adjusts based on output from vs-screen
  //  - Feed said query into replay-list for searching
  query = signal<VideoSearch>({
    player1: '',
    player2: '',
    char1: '',
    char2: '',
    assist1: '',
    assist2: '',
    version: 2,
    sort: '',
  });

  isEmpty = signal<boolean>(true);
  videosResource = this.videoRequestService.getVideos(this.isEmpty, this.query);

  // Using any is sloppy, and I should find a nicer way of doing it if I can
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateQueryParam({ key, value }: { key: keyof VideoSearch; value: any }) {
    // .update() isn't notifying dependancies, so need to make deep copy of query
    const newQuery: VideoSearch = { ...this.query() };
    newQuery[key] = value;
    this.query.set(newQuery);

    // Check if query is empty, and update accordingly
    let empty = true;

    Object.keys(this.query()).forEach((key) => {
      const newKey: keyof VideoSearch = key as keyof VideoSearch;
      if (key !== 'version' && this.query()[newKey]) empty = false;
      else if (key === 'version' && this.query()[newKey] !== 2) empty = false;
    });

    this.isEmpty.set(empty);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ignite Boost - Search Replays');
    this.meta.addTag({ name: 'title', content: 'Ignite Boost - Search Replays' });
    this.meta.addTag({
      name: 'description',
      content:
        'A searchable gallery of replays for Dengeki Bunko Fighting Climax, as well as its Ignition update.',
    });
  }

  // Reset back to DFCI theme on page change
  ngOnDestroy(): void {
    document.body.classList.remove('dfc-theme');
    document.body.classList.add('dfci-theme');
  }
}
