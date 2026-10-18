import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VsScreen } from './vs-screen/vs-screen';
import { ReplayList } from './replay-list/replay-list';
import { VideoSearch } from '../api/video-service/Videos';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoRequests } from '../api/video-service/video-requests';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { combineLatest as paramRoutes } from 'rxjs';

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
  route = inject(ActivatedRoute);
  router = inject(Router, { optional: true });
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
  updateQueryParam({ key, value }: { key: keyof VideoSearch; value: any }, updateUrl = true) {
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

    const urlParams: Partial<Record<keyof VideoSearch, string>> = {
      char1: 'character',
      assist1: 'assist',
    };
    const urlParam = urlParams[key];

    if (urlParam && updateUrl) {
      this.router?.navigate([], {
        relativeTo: this.route,
        queryParams: { [urlParam]: value || null },
        queryParamsHandling: 'merge',
      });
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ignite Boost - Search Replays');
    this.meta.addTag({ name: 'title', content: 'Ignite Boost - Search Replays' });
    this.meta.addTag({
      name: 'description',
      content:
        'A searchable gallery of replays for Dengeki Bunko Fighting Climax, as well as its Ignition update.',
    });

    paramRoutes([this.route.params, this.route.queryParams]).subscribe(([routeParams, queryParams]) => {
      const params: Partial<Record<keyof VideoSearch, string>> = {
        player1: routeParams['name'],
        char1: queryParams['character'],
        assist1: queryParams['assist'],
      };

      Object.keys(params).forEach((key) => {
        const newKey = key as keyof VideoSearch;
        if (params[newKey]) {
          this.updateQueryParam({ key: newKey, value: params[newKey] }, false);
        }
      });
    });
  }

  // Reset back to DFCI theme on page change
  ngOnDestroy(): void {
    document.body.classList.remove('dfc-theme');
    document.body.classList.add('dfci-theme');
  }
}
