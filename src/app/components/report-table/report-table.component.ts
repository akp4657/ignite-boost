import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/video.service.ts';

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
    this.route.params.subscribe(params => {
      this.selectedUserID = params['id'];
      if(this.selectedUserID) this.setUserTable()
    })
  }

  setUserTable() {
    this.videoService.getUsers().subscribe((data: any) => {
      let user = data.users.filter((u: any) => u.Slack_ID == this.selectedUserID)[0]
      let task_strings = user.Wrike_Task_String.concat(user.Zendesk_Task_String)
      this.dataSource = new MatTableDataSource(task_strings);
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}