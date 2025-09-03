import { Component, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ImageLoader } from '../../components/image-loader/image-loader';
import { VideoEmbed } from './video-embed/video-embed';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatExpansionModule } from "@angular/material/expansion";
import { DefaultVideoData, VideoData } from '../VideoData';

@Component({
  selector: 'app-video-preview',
  imports: [
    VideoEmbed,
    NgClass,
    ImageLoader,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    OverlayModule,
    MatExpansionModule
],
  templateUrl: './video-preview.html',
  styleUrl: './video-preview.scss'
})
export class VideoPreview {
  urlData = signal<VideoData>(DefaultVideoData);
  versionSelOpen = signal<boolean>(false);

  updateVideoData = output<VideoData>();

  updateDate(date: string) {
    const temp = {...this.urlData()};
    temp['date'] = date;
    this.urlData.set(temp);

    this.updateVideoData.emit(this.urlData());
  }

  parseURL(url: string) {
    // Regexes to check for valid YouTube, NicoNico, BiliBili, and Twitch videos respectively
    const regexes: RegExp[] = [];
    regexes.push(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/))((\w|-){11})(?:\S+)?$/);
    regexes.push(/^(?:https?:\/\/)?(?:m\.|www\.|embed\.|live\.)?(?:nicovideo\.jp\/(?:watch\/))(sm(\w|-){8}|so(\w|-){8}|lv(\w|-){9})(?:\S+)?$/);
    regexes.push(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:bilibili\.com\/(?:video\/))((\w|-){12})(?:\S+)?$/);
    regexes.push(/^(?:https?:\/\/)?(?:m\.|www\.|player\.)?(?:twitch\.tv\/(?:videos\/))((\d|-){8,12})(?:\S+)?$/);

    let videoSrc = -1;
    regexes.forEach((regex, index) => {
      if (url.match(regex)) videoSrc = index;
    });

    const temp = {...this.urlData()};
    temp['url'] = url;
    temp['id'] = (videoSrc !== -1) ? url.match(regexes[videoSrc])![1] : '';
    temp['src'] = videoSrc;
    this.urlData.set(temp);

    this.updateVideoData.emit(this.urlData());
  }

  updateVersionSelect(newVersion: number) {
    // Update theme based on selection made
    document.body.classList.remove((newVersion === 2) ? 'dfc-theme' : 'dfci-theme');
    document.body.classList.add((newVersion === 2) ? 'dfci-theme' : 'dfc-theme');

    this.versionSelOpen.set(false);
    this.urlData.update(data => {
      data['version'] = newVersion;
      return data;
    });

    this.updateVideoData.emit(this.urlData());
  }
}
