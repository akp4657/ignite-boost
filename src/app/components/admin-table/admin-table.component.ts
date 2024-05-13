import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SlackService } from 'src/app/services/slack.service';
import { EditUserModalComponent } from 'src/app/modals/submission-checklist-modal/edit-user-modal.component';

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
  slackService: SlackService;

  public now: Date = new Date();
  constructor(private resolver: ComponentFactoryResolver, slackService: SlackService, private route: ActivatedRoute) {
    this.slackService = slackService;
  }

  ngOnInit(): void {
    this.slackService.getUsers().subscribe((data: any) => {
      let task_strings = undefined
      let userArray: any = [];
      
      for(let u of data.users) {
        let platform;
        if(u.Zendesk_ID && u.Wrike_ID) platform = 'Both'
        else if(u.Zendesk_ID && !u.Wrike_ID) platform = 'Zendesk'
        else platform = 'Wrike'

        userArray.push({
          user: `${u.First_Name} ${u.Last_Name}`,
          platforms: platform,
          active: u.Active ? 'Active' : 'Inactive',
          slackID: u.Slack_ID,
          email: u.Email
        })
      }

      this.dataSource = new MatTableDataSource(userArray);
    });
  }

  openEditUserModal(row: any) {
    const modal = this.modalHolder.createComponent(EditUserModalComponent)
    modal.instance.active = row.active;
    if(row.platforms == 'Both') {
      modal.instance.wrike = true;
      modal.instance.zendesk = true;
    } else if(row.platforms == 'Zendesk') modal.instance.zendesk = true;
    else modal.instance.wrike = true;
    modal.instance.user = row.user
    modal.instance.userSlackID = row.slackID
    modal.instance.userEmail = row.email

    modal.instance.close.subscribe(res => {
      this.modalHolder.clear();
      if(res.success) window.location.reload();
      //window.location.reload();
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
  }
}