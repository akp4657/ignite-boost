import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss']
})
export class AdminTableComponent implements AfterViewInit {
  today_date = new Date().toLocaleDateString();
  displayedColumns: string[] = ['user', 'platforms', 'active'];
  dataSource = new MatTableDataSource();

  selectedUserID: any = undefined;

  @ViewChild('modalHolder', { read: ViewContainerRef, static: false })
  modalHolder!: ViewContainerRef;
  videoService: VideoService;

  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, videoService: VideoService, private route: ActivatedRoute) {
    this.videoService = videoService;
  }

  ngOnInit(): void {
    // this.videoService.getUsers().subscribe((data: any) => {
    //   let task_strings = undefined
    //   let userArray: any = [];
      
    //   for(let u of data.users) {
    //     let platform;
    //     if(u.Zendesk_ID && u.Wrike_ID) platform = 'Both'
    //     else if(u.Zendesk_ID && !u.Wrike_ID) platform = 'Zendesk'
    //     else platform = 'Wrike'

    //     userArray.push({
    //       user: `${u.First_Name} ${u.Last_Name}`,
    //       platforms: platform,
    //       active: u.Active ? 'Active' : 'Inactive',
    //       slackID: u.Slack_ID,
    //       email: u.Email
    //     })
    //   }

    //   this.dataSource = new MatTableDataSource(userArray);
    // });
  }


  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}