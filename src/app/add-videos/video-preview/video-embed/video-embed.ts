import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-embed',
  imports: [],
  templateUrl: './video-embed.html',
  styleUrl: './video-embed.scss'
})
export class VideoEmbed {
  private sanitizer = inject(DomSanitizer);

  videoID = input.required<string>();
  videoSrc = input.required<number>(); // -1: N/A, 0: YouTube, 1: NicoNico, 2: BiliBili, 3: Twitch

  iframeSrc = computed<SafeResourceUrl>(() => {
    let url = '';

    switch (this.videoSrc()) {
      case 0:
        url = `https://www.youtube.com/embed/${this.videoID()}`;
        break;

      case 1:
        url = `https://embed.nicovideo.jp/watch/${this.videoID()}`;
        break;

      case 2:
        url = `https://player.bilibili.com/player.html?isOutside=true&bvid=${this.videoID()}`;
        break;

      case 3:
        url = `https://player.twitch.tv/?video=${this.videoID()}&parent=ignite-boost.net`;
        break;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
