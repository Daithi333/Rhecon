import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Group } from './group-model';
import { GroupsService } from './groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {
  isLoading = false;
  groups: Group[] = [];
  private groupsSub: Subscription;

  constructor(private groupsService: GroupsService) { }

  ngOnInit() {
    this.groupsSub = this.groupsService.groups.subscribe(groups => {
      this.groups = groups;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.groupsService.fetchGroupsWithMembers().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.groupsSub) {
      this.groupsSub.unsubscribe();
    }
  }

}
