import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements AfterViewInit {
  today_date = new Date().toLocaleDateString();
  displayedColumns: string[] = ['player1', 'assist1', 'char1', 'char2', 'assist2', 'player2', 'link', 'version', 'matchDate'];
  dataSource = new MatTableDataSource([]);

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;
  videoService: VideoService;

  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, videoService: VideoService, private route: ActivatedRoute) {
    this.videoService = videoService;
  }

  ngOnInit(): void {
    console.log('Home')
    this.setUserTable()
    console.log(this.dataSource)
  }

  setUserTable() {
    this.videoService.getVideos().subscribe((data: any) => {
      let videos = data.data.slice(0,10)
      console.log(videos)
      this.dataSource = new MatTableDataSource(videos);
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}