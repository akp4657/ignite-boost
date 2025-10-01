import {
  Component,
  OnInit,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { VideoPreview } from './video-preview/video-preview';
import { MatchInfo } from './match-info/match-info';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoRequests } from '../api/video-service/video-requests';
import { VideoData, DefaultVideoData, MatchItem } from './VideoData';
import { ReplayInfo } from '../api/video-service/Videos';
import { Response } from '../api/Response';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-videos',
  imports: [NgClass, VideoPreview, MatchInfo, MatProgressSpinnerModule],
  templateUrl: './add-videos.html',
  styleUrl: './add-videos.scss',
})
export class AddVideos implements OnInit, OnDestroy {
  meta = inject(Meta);
  titleService = inject(Title);
  videoRequestService = inject(VideoRequests);
  snackBar = inject(MatSnackBar);

  matchList = signal<MatchItem[]>([
    {
      data: {
        player1: '',
        char1: '',
        assist1: '',
        player2: '',
        char2: '',
        assist2: '',
        timestamp: '',
      },
      index: 0,
      valid: false,
    },
  ]);
  videoData = signal<VideoData>(DefaultVideoData);
  videoDataValid = signal<boolean>(false);
  matchesValid = signal<boolean>(false);

  savingMatches = signal<boolean>(false);

  enableSubmit = computed<boolean>(
    () => this.matchesValid() && this.videoDataValid()
  );

  updateVideoData(newData: VideoData) {
    this.videoData.set(newData);

    this.videoDataValid.set(this.isVideoDataValid());
  }

  updateMatchList(item: MatchItem) {
    const { data, index, valid } = item;

    this.matchList.update((matches) => {
      matches[index].data = data;
      matches[index].index = index;
      matches[index].valid = valid;

      return matches;
    });

    this.matchesValid.set(this.areMatchesValid());
  }

  deleteMatchEntry(deletionIndex: number) {
    const temp = this.matchList().filter(
      (match, index) => index !== deletionIndex
    );
    this.matchList.set(temp);

    this.matchesValid.set(this.areMatchesValid());
  }

  addMatch() {
    const temp = this.matchList();
    temp.push({
      data: {
        player1: '',
        char1: '',
        assist1: '',
        player2: '',
        char2: '',
        assist2: '',
        timestamp: '',
      },
      index: 0,
      valid: false,
    });

    this.matchList.set(temp);
    this.matchesValid.set(this.areMatchesValid());
  }

  // Parse match data as a whole and make a request to API to add videos
  async submitMatches() {
    this.savingMatches.set(true);
    const replays: ReplayInfo[] = this.matchList().map((match) => match.data);
    const response: Response = await this.videoRequestService.addVideos(
      this.videoData(),
      replays
    );

    // Clear matchList signal
    this.matchList.set([
      {
        data: {
          player1: '',
          char1: '',
          assist1: '',
          player2: '',
          char2: '',
          assist2: '',
          timestamp: '',
        },
        index: 0,
        valid: false,
      },
    ]);

    this.savingMatches.set(false);

    // Display results in SnackBar
    this.snackBar.open(response.error ?? response.message ?? '', 'Dismiss');
  }

  // Check videoData to ensure it's properly filled out
  isVideoDataValid(): boolean {
    if (
      Number.isNaN(new Date(this.videoData().date).getTime()) ||
      this.videoData().src === -1 ||
      this.videoData().id === ''
    ) {
      return false;
    }

    return true;
  }

  // Check if all match data is currently valid for submission
  areMatchesValid(): boolean {
    for (const match of this.matchList()) {
      if (!match.valid) return false;
    }

    return true;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Ignite Boost - Add Videos');
    this.meta.addTag({ name: 'title', content: 'Ignite Boost - Add Videos' });
    this.meta.addTag({
      name: 'description',
      content:
        'A form allowing users to submit multiple video timestamps for different matches of Dengeki Bunko Fighting Climax and its Ignition update.',
    });
  }

  // Reset back to DFCI theme on page change
  ngOnDestroy(): void {
    document.body.classList.remove('dfc-theme');
    document.body.classList.add('dfci-theme');
  }
}
