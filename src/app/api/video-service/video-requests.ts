import { Injectable, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Video, VideoSearch, ReplayInfo } from './Videos';
import { VideoData } from '../../add-videos/VideoData';
import { Response } from '../Response';

@Injectable({
  providedIn: 'root'
})
export class VideoRequests {
  getVideos(isEmpty: Signal<boolean>, query: Signal<VideoSearch>) {
    return httpResource<any>(() => ({
      url: (isEmpty()) ? '/api/getAllVideos' : '/api/search',
      method: 'GET',
      params: (isEmpty()) ? undefined : {
        'player1': query().player1 ?? '',
        'player2': query().player2 ?? '',
        'char1': query().char1 ?? '',
        'char2': query().char2 ?? '',
        'assist1': query().assist1 ?? '',
        'assist2': query().assist2 ?? '',
        'version': query().version ?? ''
      }
    }));
  }

  async addVideos(videoData: VideoData, replays: ReplayInfo[]): Promise<Response> {
    let incompleteURL = '';

    // Set up URL, barring timestamp
    switch (videoData.src) {
      // YouTube
      case 0:
        incompleteURL += `https://youtu.be/${videoData.id}?t=`;
        break;

      // Niconico
      case 1:
        incompleteURL += `https://www.nicovideo.jp/watch/${videoData.id}?from=`;
        break;

      // Bilibili
      case 2:
        incompleteURL += `https://www.bilibili.com/video/${videoData.id}/?t=`;
        break;

      // Twitch
      case 3:
        incompleteURL += `https://www.twitch.tv/videos/${videoData.id}/?t=`;
    }

    // Format URL based on video source
    const newVideos = replays.map(replay => {
      // Start by generating date object to calculate elapsed seconds
      const hours = parseInt(replay.timestamp.substring(0, 2), 10);   // Hours
      const minutes = parseInt(replay.timestamp.substring(3, 5), 10); // Minutes
      const seconds = parseInt(replay.timestamp.substring(6), 10);    // Seconds

      let completeURL;

      // Twitch does it differently from everyone else
      if (videoData.src !== 3) completeURL = `${incompleteURL}${(hours * 3600) + (minutes * 60) + seconds}`;
      else completeURL = `${incompleteURL}${hours}h${minutes}m${seconds}s`;

      const newVideo: Video = {
        matchDate: videoData.date,
        player1: replay.player1,
        char1: replay.char1,
        assist1: replay.assist1,
        player2: replay.player2,
        char2: replay.char2,
        assist2: replay.assist2,
        link: completeURL,
        version: videoData.version,
      };

      return newVideo;
    });

    const req = await fetch('/api/makeVideos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newVideos),
    });
    const res = await req.json();

    return res;
  }
}
