import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SidebarItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  // Default Items which will show 'Loading...'
  sidebarItems: SidebarItem[] = [{
    name: 'Loading...',
    url: ''
  }];
  //slackService: SlackService;

  constructor(public router: Router) {
    //this.slackService = slackService;
  }

  ngOnInit(): void {
  }

  // Move to a specific user's page
  navigateToTeam(url: string) {
    this.router.navigate([url]);
  }
}